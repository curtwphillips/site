import React from 'react';
import ReactFlow from 'react-flow-renderer';

const connectorStyles = {
  height: '0px',
};

const elements = [
  {
    id: '1',
    type: 'default', // input node
    data: { label: 'Curtis Phillips' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Ameena Phillips</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: 'connector',
    // you can also pass a React component as a label
    data: { label: <div></div> },
    position: { x: 100, y: 125 },
    isHidden: true,
    styles: connectorStyles,
  },
  {
    id: '3',
    type: 'output', // output node
    data: { label: 'Noah Phillips' },
    position: { x: 250, y: 250 },
  },
  {
    id: '4',
    type: 'output', // output node
    data: { label: 'Isaac Phillips' },
    position: { x: 270, y: 270 },
  },
  { id: 'e-1-connector', source: '1', target: 'connector' },
  { id: 'e-2-connector', source: '2', target: 'connector' },
  { id: 'e-connector-3', source: 'connector', target: '3' },
  { id: 'e-connector-4', source: 'connector', target: '4' },
];

export default function FamilyTree() {
  return (
    <div style={{ height: 300 }}>
      <ReactFlow elements={elements} />
    </div>
  )
};