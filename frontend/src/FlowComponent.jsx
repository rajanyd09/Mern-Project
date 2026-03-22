import React, { useState } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, useReactFlow, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import { Bot, User, Sparkles, Save, Play } from 'lucide-react';

const InputNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow();

  return (
    <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-5 w-[300px] backdrop-blur-md shadow-2xl hover:border-sky-500/50 transition-all text-slate-100">
      <div className="flex items-center gap-2 text-xs font-bold mb-4 text-sky-400 uppercase tracking-widest">
        <User size={16} />
        <span>User Prompt</span>
      </div>
      <textarea
        className="w-full min-h-[100px] bg-slate-950/50 border border-white/10 rounded-lg text-slate-100 p-3 font-inherit text-[0.9rem] resize-y outline-none focus:border-violet-500 focus:bg-slate-950/80 transition-all nodrag nopan"
        value={data.value || ''}
        onChange={(e) => updateNodeData(id, { value: e.target.value })}
        placeholder="Type your prompt here..."
      />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-violet-500 !border-2 !border-slate-900 !rounded-full z-10 hover:!bg-white hover:!shadow-[0_0_10px_#8b5cf6]" />
    </div>
  );
};

const OutputNode = ({ data }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-5 w-[300px] backdrop-blur-md shadow-2xl hover:border-violet-500/50 transition-all text-slate-100">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-violet-500 !border-2 !border-slate-900 !rounded-full z-10 hover:!bg-white hover:!shadow-[0_0_10px_#8b5cf6]" />
      <div className="flex items-center gap-2 text-xs font-bold mb-4 text-violet-400 uppercase tracking-widest">
        <Bot size={16} />
        <span>AI Response</span>
      </div>
      <div className="bg-slate-950/50 border border-white/5 rounded-lg p-4 min-h-[100px] max-h-[250px] overflow-y-auto text-[0.95rem] leading-relaxed text-slate-200">
        {data.isLoading ? (
          <div className="flex items-center gap-2 text-violet-500 font-medium h-full italic">
            <Sparkles size={18} className="animate-spin" /> Generating...
          </div>
        ) : (
           <div className="whitespace-pre-wrap">{data.value}</div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
};

const initialNodes = [
  {
    id: 'input-node',
    type: 'inputNode',
    position: { x: 100, y: 150 },
    data: { label: 'Input Prompt', value: '' }
  },
  {
    id: 'output-node',
    type: 'outputNode',
    position: { x: 500, y: 150 },
    data: { label: 'AI Response', value: 'Generated response will appear here...' }
  }
];

const initialEdges = [
  { id: 'e1-2', source: 'input-node', target: 'output-node', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }
];

const FlowComponent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));

  const runFlow = async () => {
    const inputNode = nodes.find(n => n.id === 'input-node');
    const promptValue = inputNode?.data?.value || '';
    
    if (!promptValue.trim()) return;
    
    setIsLoading(true);
    setSaveStatus('');
    
    setNodes((nds) => nds.map((node) => {
      if (node.id === 'output-node') {
        return { ...node, data: { ...node.data, isLoading: true } };
      }
      return node;
    }));

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ask-ai`, { prompt: promptValue });
      const responseValue = res.data.response;
      
      setNodes((nds) => nds.map((node) => {
        if (node.id === 'output-node') {
          return { ...node, data: { ...node.data, isLoading: false, value: responseValue } };
        }
        return node;
      }));
    } catch (err) {
      console.error(err);
      setNodes((nds) => nds.map((node) => {
        if (node.id === 'output-node') {
          return { ...node, data: { ...node.data, isLoading: false, value: err.response?.data?.error || 'An error occurred while generating the response.' } };
        }
        return node;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const saveInteraction = async () => {
    const inputNode = nodes.find(n => n.id === 'input-node');
    const outputNode = nodes.find(n => n.id === 'output-node');
    const promptValue = inputNode?.data?.value || '';
    const responseValue = outputNode?.data?.value || '';
    
    // Avoid saving empty values or default placeholder text
    if (!promptValue.trim() || !responseValue.trim() || isLoading || responseValue === 'Generated response will appear here...') return;
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    try {
      await axios.post(`${API_BASE_URL}/api/save`, { prompt: promptValue, response: responseValue });
      setSaveStatus('Saved to Database!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('Error saving.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Determine button disabled states
  const inputNode = nodes.find(n => n.id === 'input-node');
  const outputNode = nodes.find(n => n.id === 'output-node');
  const promptValue = inputNode?.data?.value || '';
  const responseValue = outputNode?.data?.value || '';
  const isSaveDisabled = !promptValue.trim() || !responseValue.trim() || isLoading || responseValue === 'Generated response will appear here...';

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      <div className="flex-none px-8 py-5 bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 flex justify-between items-center z-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
          Gemini Flow Canvas
        </h1>
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:-translate-y-1 hover:shadow-purple-500/40 active:scale-95" 
            onClick={runFlow} 
            disabled={isLoading || !promptValue.trim()}
          >
            <Play size={16} fill="currentColor" />
            <span>{isLoading ? 'Running...' : 'Run Flow'}</span>
          </button>
          
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-emerald-500/40 active:scale-95" 
            onClick={saveInteraction} 
            disabled={isSaveDisabled}
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          
          {saveStatus && <span className="text-xs font-bold text-emerald-400 animate-pulse">{saveStatus}</span>}
        </div>
      </div>
      
      <div className="flex-1 w-full bg-[#0f172a] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_100%)]"
        >
          <Background color="#1e293b" gap={20} variant="dots" />
          <Controls className="!bg-slate-900/90 !border-slate-800 !shadow-2xl" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowComponent;
