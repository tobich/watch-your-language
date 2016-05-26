import React from 'react';
import Ace from 'react-ace';
import ReactDOM from 'react-dom';

const babel = require('babel-core');
import plugin from '../lib/plugin';
const validator = require('../lib/validator');

function transpile(source) {
    return babel.transform(source, {
        plugins: [plugin]
    }).code;
}

const aceFont = "12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace";

const outputStyle = {
    'log': {
        font: aceFont,
        'color': 'blue'
    },
    'error': {
        font: aceFont,
        color: 'red'
    }
};

class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            output: []
        }
    }

    onChange(code) {
        let compiledCode;
        const setState = this.setState.bind(this);
        const output = [];
        const __validate__ = validator(function (message) {
            output.push({
                level: 'error',
                text: message
            });
            throw new Error(message);
        });
        const console = {
            log(...args) {
                output.push({
                    level: 'log',
                    text: args.join('')
                });
            }
        };
        try {
            compiledCode = transpile(code);
            eval(compiledCode);
        } catch (err) {}

        this.setState({
            output,
            code
        });

    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.editor).focus();
    }

    render() {
        return (
            <div>
                <Ace ref="editor" value={this.state.code} mode="javascript" theme="github" onChange={this.onChange.bind(this)}/>
                <div>
                    {
                        this.state.output.map(out => <p style={outputStyle[out.level]}>{out.level} &gt; {out.text}</p>)
                    }
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Playground/>, document.querySelector('#playground'));