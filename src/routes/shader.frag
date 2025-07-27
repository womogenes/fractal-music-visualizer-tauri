#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float r;
uniform float g;
uniform float b;
uniform vec2 c;
uniform float zoom;

vec2 mul_c(vec2 a, vec2 b) {
  // Complex multiplication
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + b.x * a.y);
}

float julia(vec2 z, vec2 c) {
  // Return 0 if in Julia set, otherwise length
  float gamma = 0.5;

  for (int i = 0; i < 100; i++) {
    z = mul_c(z, z) + c;
    if (length(z) > 100.0) {
      float nu = float(i) + 0.0 - log(log(length(z))) / log(2.0);
      return pow(nu, gamma) * 0.1;
    }
  }

  // return 1. - length(z);
  return 0.0;
}

float pal(float t) {
  // Convert color palette 
  return 0.0;
}

vec3 cmap(float t) {

  // Clamp input to [0,1]
  t = clamp(t, 0.0, 1.0);

  // Define colors
  vec3 beige = vec3(1.0, 0.96, 0.85);     // warm white/beige (R, G, B)
  vec3 dullBlue = vec3(0.35, 0.48, 0.65); // dullish blue
  vec3 black = vec3(0.0, 0.0, 0.0);       // black

  if (t < 0.05) {
    // Interpolate from beige to blue
    return vec3(1.0, 0.0, 0.0);
    return mix(beige, dullBlue, t / 0.5);
  } else {
    // Interpolate from blue to black
    return mix(dullBlue, black, (t - 0.5) / 0.5);
  }
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
  // Norrmalized coordinates (ish)
  vec2 xy = (gl_FragCoord.xy - u_resolution / 2.0) / u_resolution.x;

  vec2 z = xy * zoom;
  float res = julia(z, c);

  vec3 color = cmap(res);

  color = vec3(res, res, res);
  gl_FragColor = vec4(color, 1.0);

  // gl_FragColor = vec4(res, res, res, 1.0);
  // gl_FragColor = vec4(xy.x, xy.y, 0.0, 1.0);
  // gl_FragColor = vec4(c.x, c.y, 0., 1.0);
}
