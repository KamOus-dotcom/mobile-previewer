import config from 'react-native-config'

import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import ShakeEvent from 'react-native-shake-event'
import { connectActionSheet } from '@expo/react-native-action-sheet'

import { getApp } from '../../ducks/apps'
import Runner from '@protonapp/proton-runner'

class Viewer extends Component {
  menuOpen = false

  handleClose = () => {
    let { navigation } = this.props

    navigation.dispatch(NavigationActions.back())
  }

  handleShake = () => {
    if (this.menuOpen) { return }
    this.menuOpen = true

    this.props.showActionSheetWithOptions({
      options: ['Cancel', 'Reload', 'All Apps'],
      cancelButtonIndex: 0
    }, index => {
      this.menuOpen = false

      if (index === 1) {
        // Reload
        console.log("CLICKED RELOAD!")
      } else if (index === 2) {
        // Exit
        this.handleClose()
      }
    })
  }

  componentWillMount() {
    ShakeEvent.addEventListener('shake', this.handleShake)
  }

  componentWillUnmount() {
    ShakeEvent.removeEventListener('shake')
  }

  render() {
    let { app } = this.props

    let baseURL = config.REACT_APP_DATABASE_URL

    return (
      <View style={styles.view}>
        <Runner app={app} baseURL={baseURL} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
})

const mapStateToProps = (state, ownProps) => ({
  app: getApp(state, ownProps.navigation.state.params.appId)
})

export default connectActionSheet(connect(mapStateToProps)(Viewer))
