import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import * as beatScheduler from '../helpers/beatScheduler'
import './App.css'
import Header from '../components/Header'
import PlayButton from '../components/PlayButton'
import SequencerGrid from '../components/SequencerGrid'

class App extends Component {
  constructor (props) {
    super(props)

    this.bpm = 170

    this.beatScheduleTick = this.beatScheduleTick.bind(this)
    this.startPlaying = this.startPlaying.bind(this)
    this.stopPlaying = this.stopPlaying.bind(this)
  }

  nextActiveColumnState () {
    const nextActiveColumn = (this.props.activeColumn + 1) % 16
    return this.props.pads[nextActiveColumn]
  }

  beatScheduleTick () {
    beatScheduler.check((time) => {
      const activeTracks = this.nextActiveColumnState()
      beatScheduler.schedule(this.props.samples, activeTracks, time)
      beatScheduler.nextBeat(this.bpm)
      this.props.nextActiveColumn()
    })
  }

  startPlaying () {
    beatScheduler.start()
    this.props.nextActiveColumn()
    this.beatScheduleTick()
    this.beatScheduleInterval = setInterval(
      this.beatScheduleTick,
      25
    )
  }

  stopPlaying () {
    clearInterval(this.beatScheduleInterval)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.playing !== this.props.playing) {
      nextProps.playing ? this.startPlaying() : this.stopPlaying()
    }
  }

  render () {
    return (
      <div className='App'>
        <Header>
          <PlayButton
            playing={this.props.playing}
            togglePlaying={this.props.togglePlaying} />
        </Header>
        <SequencerGrid
          playing={this.props.playing}
          pads={this.props.pads}
          activeColumn={this.props.activeColumn}
          togglePad={this.props.togglePad} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  samples: state.samples,
  pads: state.pads,
  playing: state.playing,
  activeColumn: state.activeColumn
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  togglePad: (track, pad) => {
    dispatch(actions.togglePad(track, pad))
  },
  togglePlaying: () => {
    dispatch(actions.togglePlaying())
  },
  nextActiveColumn: () => {
    dispatch(actions.nextActiveColumn())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
