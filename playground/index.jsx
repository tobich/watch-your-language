import React from 'react';
import Ace from 'react-ace';
import ReactDOM from 'react-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

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
    },
    'console': {
        position: 'fixed',
        width: '100%',
        height: '33vh',
        bottom: 0,
        zIndex: 999,
        background: 'white'
    }
};

const sampleCode1 = `
    const a = "flame";
    const b = "flippers";
    const c = "furry";
    
    console.log(a,b,c);
`;

const sampleCode2 = `
    function f(word) {
        return "f" + word;
    }
    
    var arr = ["lame", "lippers", "urry" ];
    
    var result = arr
        .map(f)
        .forEach(word => console.log(word));
`;

class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: sampleCode1,
            output: []
        }
    }

    runCode(code) {
        const output = [];
        let compiledCode;
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
                    text: args.join(' ')
                });
            }
        };
        try {
            compiledCode = transpile(code);
        } catch(err) {
            return false;
        }
        try {
            eval(compiledCode);
        } catch (err) {
        }
        return this.setState({
            output,
            code
        });
    }

    onChange(code) {
        if(this.runCode(code)) {
            this.setState({
                code
            });
        }
    }

    componentDidMount() {
        const editor = ReactDOM.findDOMNode(this.refs.editor);
        editor.focus();
        editor.addEventListener('keydown', event => {
            if(event.ctrlKey) {
                if(event.keyCode === 49) {
                    this.setState({
                        code: sampleCode1
                    });
                    this.runCode(sampleCode1);
                }
                if(event.keyCode === 50) {
                    this.setState({
                        code: sampleCode2
                    });
                    this.runCode(sampleCode2);
                }
            }
        });
        this.runCode(this.state.code);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <Tabs>
                        <Tab label="Source">
                            <Ace ref="editor" value={this.state.code} mode="javascript" theme="github"
                                 onChange={this.onChange.bind(this)}
                                 width="100%"
                                 height="100vh"
                            />
                        </Tab>
                        <Tab label="Target">
                            <pre>{transpile(this.state.code)}</pre>
                        </Tab>
                    </Tabs>
                    <div style={outputStyle.console}>
                        {
                            this.state.output.map(out => <p
                                style={outputStyle[out.level]}>{out.level} &gt; {out.text}</p>)
                        }
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<Playground/>, document.querySelector('#playground'));