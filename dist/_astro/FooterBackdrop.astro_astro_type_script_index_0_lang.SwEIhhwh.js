import{g as s,D as z,b as V,c as q,d as J,e as Y,f as j,a as _,h as Q,i as Z,j as tt,k as et}from"./dotField.DVWPvsHt.js";import{m as ot}from"./mountCanvas.7yxo195c.js";const c=96,rt=40,W=3,nt=5,it=.03,at=1/3,st=.4,ct=`
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`,lt=`
precision highp float;

uniform vec2 u_resolution;
uniform float u_dpr;
uniform float u_time;
uniform float u_pointer;
uniform float u_hasTrail;
uniform vec2 u_trail[${c}];

const int TRAIL_N = ${c};
const float PITCH = ${s(z)};
const float RADIUS = 0.5;
const float GAP_BOTTOM = 4.0;
const float TAU = 6.2831853;
const float TWINKLE_MIN = ${s(V)};
const float TWINKLE_MAX = ${s(q)};
const float MID_FRACTION = ${s(J)};
const float BRIGHT_FRACTION = ${s(Y)};
const float TWINKLE_FLOOR = ${s(j)};
// Ragged top: a per-dot cut-off height, random across the top RAG_DEPTH of the
// footer (see the JS constant).
const float RAG_DEPTH = ${s(at)};
// Overall brightness multiplier on the lit dots (Josh, Sept 2026: a touch dimmer).
const float LUMINANCE = ${s(st)};

const vec3 COL_MAIN = ${_(Q)};
const vec3 COL_MID = ${_(Z)};
const vec3 COL_BRIGHT = ${_(tt)};
const vec3 COL_BASE = ${_(et)};

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float mound(float cx, vec2 uv, float rx, float ry) {
  vec2 dd = vec2((uv.x - cx) / rx, uv.y / ry);
  return 1.0 - clamp(abs(dd.x) + abs(dd.y), 0.0, 1.0);
}

void main() {
  vec2 pcss = gl_FragCoord.xy / u_dpr;
  vec2 resCss = u_resolution / u_dpr;

  float halfW = resCss.x * 0.5;
  float cIdx = floor((pcss.x - halfW) / PITCH + 0.5);
  float base = (GAP_BOTTOM + RADIUS) + mod(cIdx, 2.0) * (PITCH * 0.5);
  float rIdx = floor((pcss.y - base) / PITCH + 0.5);
  vec2 dotPos = vec2(halfW + cIdx * PITCH, base + rIdx * PITCH);

  float aa = 0.5 / u_dpr;
  float coverage = 1.0 - smoothstep(RADIUS - aa, RADIUS + aa, length(pcss - dotPos));

  vec2 uv = dotPos / resCss;
  float rx = max(0.85, 2.193 * (u_resolution.y / u_resolution.x));
  float ry = 1.3;
  float intensity = mound(u_pointer, uv, rx, ry);
  if (u_hasTrail > 0.5) {
    for (int i = 0; i < TRAIL_N; i++) {
      vec2 tp = u_trail[i];
      intensity = max(intensity, mound(tp.x, uv, rx, ry) * tp.y);
    }
  }

  vec2 cell = vec2(cIdx, rIdx);
  float osc = 0.5 + 0.5 * sin(u_time * mix(TWINKLE_MIN, TWINKLE_MAX, hash(cell + 7.1)) + hash(cell + 3.3) * TAU);
  float twinkle = mix(TWINKLE_FLOOR, 1.0, osc);

  // Three tiers: a rare bright pinprick, a scattering of mid, the muted rest.
  float tier = hash21(cell);
  vec3 dotColor = tier < BRIGHT_FRACTION ? COL_BRIGHT : tier < BRIGHT_FRACTION + MID_FRACTION ? COL_MID : COL_MAIN;

  float cut = 1.0 - hash(cell + 5.5) * RAG_DEPTH;
  coverage *= step(uv.y, cut);

  vec3 col = mix(COL_BASE, dotColor, coverage * intensity * twinkle * LUMINANCE);
  gl_FragColor = vec4(col, 1.0);
}
`;function $(e,u,t){const n=e.createShader(u);return n?(e.shaderSource(n,t),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS)?n:(console.warn("FooterBackdrop: shader compile failed",e.getShaderInfoLog(n)),e.deleteShader(n),null)):null}function ft(e){const u=e.getContext("webgl",{antialias:!1,alpha:!1})??e.getContext("experimental-webgl");if(!u)return()=>{};const t=u,n=$(t,t.VERTEX_SHADER,ct),x=$(t,t.FRAGMENT_SHADER,lt);if(!n||!x)return()=>{};const o=t.createProgram();if(t.attachShader(o,n),t.attachShader(o,x),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS))return console.warn("FooterBackdrop: program link failed",t.getProgramInfoLog(o)),()=>{};t.useProgram(o);const k=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,k),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);const C=t.getAttribLocation(o,"a_pos");t.enableVertexAttribArray(C),t.vertexAttribPointer(C,2,t.FLOAT,!1,0,0);const l={resolution:t.getUniformLocation(o,"u_resolution"),time:t.getUniformLocation(o,"u_time"),pointer:t.getUniformLocation(o,"u_pointer"),hasTrail:t.getUniformLocation(o,"u_hasTrail"),trail:t.getUniformLocation(o,"u_trail"),dpr:t.getUniformLocation(o,"u_dpr")},O=t;try{O.drawingBufferColorSpace!==void 0&&(O.drawingBufferColorSpace="display-p3")}catch{}const E=window.matchMedia("(prefers-reduced-motion: reduce)").matches,K=!window.matchMedia("(hover: hover)").matches,p=!E;t.uniform1f(l.hasTrail,p?1:0);let f=.5,T=.5,M=-1/0,d=0;const w=new Float32Array(c),N=new Float32Array(c).fill(-1/0),I=new Float32Array(c*2);let h=0,A=-1;const v=()=>Math.min(window.devicePixelRatio||1,2);function y(){const r=e.getBoundingClientRect(),a=Math.max(1,Math.round(r.width*v())),i=Math.max(1,Math.round(r.height*v()));(e.width!==a||e.height!==i)&&(e.width=a,e.height=i,t.viewport(0,0,a,i)),t.uniform2f(l.resolution,e.width,e.height),t.uniform1f(l.dpr,v())}function P(r){d=r/1e3;const a=(f-A)*window.innerWidth;p&&(A<0||Math.abs(a)>=rt)&&(w[h]=f,N[h]=d,h=(h+1)%c,A=f),t.uniform1f(l.time,d),t.uniform1f(l.pointer,f);for(let i=0;i<c;i++){const L=d-N[i],X=L>=0&&L<W*7?Math.exp(-L/W):0;I[i*2]=w[i],I[i*2+1]=X}t.uniform2fv(l.trail,I),t.drawArrays(t.TRIANGLES,0,3)}let g=0,m=!1;function D(r){if(!e.isConnected){G();return}const a=r/1e3;p&&a-M>nt&&(T=Math.min(1,Math.max(0,.5+Math.sin(a*.13)*.32+Math.sin(a*.07)*.14))),f+=(T-f)*it,P(r),g=requestAnimationFrame(D)}function S(){m||(m=!0,g=requestAnimationFrame(D))}function R(){m=!1,cancelAnimationFrame(g)}function F(r){T=Math.min(1,Math.max(0,r.clientX/window.innerWidth)),M=d}function b(){document.hidden?R():S()}y();const B=new ResizeObserver(()=>{y(),m||P(performance.now())});B.observe(e),!E&&!K&&window.addEventListener("pointermove",F,{passive:!0}),document.addEventListener("visibilitychange",b);const H=new IntersectionObserver(([r])=>{r.isIntersecting&&!document.hidden?S():R()},{rootMargin:"200px"});H.observe(e);let U=!1;function G(){U||(U=!0,R(),B.disconnect(),H.disconnect(),window.removeEventListener("pointermove",F),document.removeEventListener("visibilitychange",b),t.getExtension("WEBGL_lose_context")?.loseContext())}return G}ot("[data-footer-backdrop]",ft,{persist:!0});
