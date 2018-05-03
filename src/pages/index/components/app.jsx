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

    dragStart=(e)=> {
        console.log(e.target)
    }
    render() {
        return (
            <div className="queue-demo">
                <p className="buttons">
                    <Button type="primary" onClick={this.onClick}>切换</Button>
                </p>
                <ul>
                    <li draggable={true} onDragStart={this.dragStart}>1111</li>
                    <li draggable={true}>2222</li>
                    <li draggable={true}>3333</li>
                    <li draggable={true}>4444</li>
                </ul>
            </div>
        );
    }
};