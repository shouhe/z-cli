import React, {Component} from 'react';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: 'test'
        }
        // fetch('/api/commodity/cpoRecommend').then((res)=> {
        //   console.log(res);
        // })

        $.ajax('/api/commodity/cpoRecommend', {
            type: 'get',
            data: {},
            success: function (res) {
                console.log(res)
            }
        })

    }

    componentDidMount() {
        console.log('mount');
    }


    render() {
        let {msg} = this.state;

        return <div>
            <h1>
                {msg}
                <a href="/item">link</a>
            </h1>
        </div>
    }
}