function RightPanel({ state, actions }) {
  const layers = Array.isArray(state.layers) ? state.layers : [];
  return (
    <aside className="right-panel">
      <div className="panel-section">
        <h4>Properties</h4>
        <div className="prop-row">
          <label>Fill</label>
          <input type="color" value={state.fillColor} onChange={actions.onFillColorChange} />
        </div>
        <div className="prop-row">
          <label>Stroke</label>
          <input type="color" value={state.strokeColor} onChange={actions.onStrokeColorChange} />
        </div>
        <div className="prop-row">
          <label>Opacity</label>
          <input type="range" min="0" max="1" step="0.01" value={state.opacity} onChange={actions.onOpacityChange} />
        </div>
      </div>

      <div className="panel-section">
        <h4>Layers</h4>
        <div className="layers" id="layersList">
          {layers.map((l, i) => (
            <div key={i} className="layer-item">
              {l}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default RightPanel;
