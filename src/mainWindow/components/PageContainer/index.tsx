import React, { Component } from "react";
import styles from "./index.module.scss";

class PageContainer extends Component {
  render() {
    return (
      <div className={styles.container} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export { PageContainer };
