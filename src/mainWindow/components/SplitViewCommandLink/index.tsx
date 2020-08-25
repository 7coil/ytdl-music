import React, { Component, ReactElement } from 'react';
import SplitViewCommand from 'react-uwp/SplitViewCommand';
import styles from './index.module.scss';
import { Link, Route } from 'react-router-dom';

class SplitViewCommandLink extends Component<{
  label?: string;
  icon?: string;
  visited?: boolean;
  iconStyle?: string;
  isTenFt?: boolean;
  showLabel?: boolean;
  revealConfig?: object;
  to?: string;
}> {
  render(): ReactElement {
    return (
      <Link to={this.props.to} className={styles.splitViewCommandLink}><SplitViewCommand {...this.props}></SplitViewCommand></Link>
    )
  }
}

export { SplitViewCommandLink };

