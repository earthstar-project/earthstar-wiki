import * as React from 'react';

export const Navbar : React.FunctionComponent = (props) =>
    <div className="navbar box">{props.children}</div>;

export const Center : React.FunctionComponent = (props) =>
    <div className="center">{props.children}</div>;

export const Stack : React.FunctionComponent = (props) =>
    <div className="stack">{props.children}</div>;

export const Box : React.FunctionComponent = (props) =>
    <div className="box">{props.children}</div>;

export const Card : React.FunctionComponent = (props) =>
    <div className="card">{props.children}</div>;

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
