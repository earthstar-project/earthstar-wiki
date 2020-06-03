import * as React from 'react';
import { Style } from 'util';

interface StyleProps {
    style? : any;
};

export const Navbar : React.FunctionComponent = (props) =>
    <div className="navbar box">{props.children}</div>;

export const Center : React.FunctionComponent = (props) =>
    <div className="center">{props.children}</div>;

export const Stack : React.FunctionComponent = (props) =>
    <div className="stack">{props.children}</div>;

export const Box : React.FunctionComponent<StyleProps> = (props) =>
    <div className="box" style={props.style}>{props.children}</div>;

export const Card : React.FunctionComponent<StyleProps> = (props) =>
    <div className="card" style={props.style}>{props.children}</div>;

export const Cluster : React.FunctionComponent = (props) =>
    // note: extra div is needed
    <div className="cluster"><div>{props.children}</div></div>;

export const Pill : React.FunctionComponent = (props) =>
    <div className="pill">{props.children}</div>;

interface TagProps {
    text : string;
};
export const Tag : React.FunctionComponent<TagProps> = ({text}) =>
    <Pill>
        <a href="#">{text}</a>
    </Pill>

export const FlexRow : React.FunctionComponent<StyleProps> = (props) =>
    <div style={{display: 'flex', ...props.style}}>
        {props.children}
    </div>;

interface FlexItemProps {
    grow? : number;
    shrink? : number;
    basis? : string | number;
    style? : any;
};
export const FlexItem : React.FunctionComponent<FlexItemProps> = (props) =>
    <div style={{
        flexGrow: props.grow,
        flexShrink: props.shrink,
        flexBasis: props.basis,
        ...props.style
    }}>
        {props.children}
    </div>;
