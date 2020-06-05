import React, { Component } from 'react';
import SplitViewCommand from 'react-uwp/SplitViewCommand';
import styles from './index.module.scss';
import { Link, Route } from 'react-router-dom';

class SplitViewCommandLink extends Component<{
  label?: string,
  icon?: string,
  visited?: boolean,
  iconStyle?: any,
  isTenFt?: boolean,
  showLabel?: boolean,
  revealConfig?: any,
  to?: string,
}> {
  render() {
    return (
      <Link to={this.props.to} className={styles.splitViewCommandLink}><SplitViewCommand {...this.props}></SplitViewCommand></Link>
    )
  }
}

export { SplitViewCommandLink };

