import * as React from 'react';

export const StoryFrameDivider : React.FunctionComponent<{title? : string}> = (props) =>
    <div style={{
        color: 'rgb(194, 45, 20)',
        fontSize: '120%',
        fontWeight: 'bold',
        padding: 10,
        marginTop: 50,
        //borderTop: '2px solid #c22d14',
    }}>{props.title || " "}</div>

interface StoryFrameProps {
    width?: string | number,
    maxWidth?: string | number,
    height?: string | number,
    minHeight?: string | number,
    title?: string,
}
export const StoryFrame : React.FunctionComponent<StoryFrameProps> = (props) =>
    <div style={{
            width: props.width,
            maxWidth: props.maxWidth,
            display: 'inline-block',
            verticalAlign: 'top',
            margin: 10,
        }}>
        <div style={{
            fontSize: '80%',
            fontWeight: 'bold',
            padding: '5px 0px',
            //color: '#444',
            color: 'rgb(194, 45, 20)',
            //textAlign: 'center',
        }}>
            {props.title || " "}
        </div>
        <div style={{
            //border: '1px dashed blue',
            background: 'white',
            boxShadow: 'rgba(0,0,0,0.3) 0px 5px 10px 0px',
            height: props.height,
            minHeight: props.minHeight,
        }}>
            {props.children}
        </div>
    </div>
