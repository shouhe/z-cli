import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import {Button} from 'antd';

export default class App extends React.Component{
    state = {
        show: true,
    };
    onClick = () => {
        this.setState({
            show: !this.state.show
        });
    }
    render() {
        return (
            <div className="queue-demo">
                <p className="buttons">
                    <Button type="primary" onClick={this.onClick}>切换</Button>
                </p>
                <QueueAnim className="demo-content"
                           animConfig={[
                               { opacity: [1, 0], translateX: [0, 50] },
                               { opacity: [1, 0], translateX: [0, 50] }
                           ]}>
                    {this.state.show ? [
                        <div className="demo-thead" key="a">
                            <ul>
                                <li />
                                <li />
                                <li />
                            </ul>
                        </div>,
                        <div className="demo-tbody" key="b">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                    ] : null}
                </QueueAnim>
            </div>
        );
    }
};