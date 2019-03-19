import React, { Component } from "react";

import SecurityContext from "../lib/SecurityContext.js";

import "./Screensaver.css";

class Screensaver extends Component {
  static contextType = SecurityContext;

  constructor(props) {
    super(props);
    this.dismissScreensaver = this.dismissScreensaver.bind(this);
  }

  dismissScreensaver() {
    this.context.updateContext({ screensaver: false });
  }

  componentDidMount() {
    // Run the screensaver for one minute
    this.timeout = setTimeout(this.dismissScreensaver, 60 * 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <div onClick={this.dismissScreensaver} className="Screensaver">
        <div className="toaster t1 p6" />
        <div className="toaster t3 p7" />
        <div className="toast tst1 p8" />
        <div className="toaster t3 p9" />
        <div className="toaster t1 p11" />
        <div className="toaster t3 p12" />
        <div className="toaster t2 p13" />
        <div className="toast tst3 p14" />
        <div className="toast tst2 p16" />
        <div className="toaster t1 p17" />
        <div className="toast tst2 p19" />
        <div className="toast tst3 p20" />
        <div className="toaster t2 p21" />
        <div className="toast tst1 p24" />
        <div className="toaster t1 p22" />
        <div className="toast tst2 p26" />
        <div className="toaster t1 p28" />
        <div className="toast tst2 p30" />
        <div className="toaster t2 p31" />
        <div className="toaster t1 p32" />
        <div className="toast tst3 p33" />

        <div className="toaster t4 p27" />
        <div className="toaster t4 p10" />
        <div className="toaster t4 p25" />
        <div className="toaster t4 p29" />

        <div className="toaster t5 p15" />
        <div className="toaster t5 p18" />
        <div className="toaster t5 p22" />

        <div className="toaster t6 p6" />
        <div className="toaster t6 p11" />
        <div className="toaster t6 p15" />
        <div className="toaster t6 p19" />
        <div className="toaster t6 p23" />

        <div className="toast tst4 p10" />
        <div className="toast tst4 p23" />
        <div className="toast tst4 p15" />
        <div className="toaster t7 p7" />
        <div className="toaster t7 p12" />
        <div className="toaster t7 p16" />
        <div className="toaster t7 p20" />
        <div className="toaster t7 p24" />

        <div className="toaster t8 p8" />
        <div className="toaster t8 p13" />
        <div className="toaster t8 p17" />
        <div className="toaster t8 p25" />

        <div className="toaster t9 p14" />
        <div className="toaster t9 p18" />
        <div className="toaster t9 p21" />
        <div className="toaster t9 p26" />
      </div>
    );
  }
}

export default Screensaver;
