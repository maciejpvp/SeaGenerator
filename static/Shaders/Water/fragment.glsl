#include <fog_pars_fragment>
varying vec3 vMixedColor;

void main() {
    gl_FragColor = vec4(vec3(vMixedColor), 1.0);
    #include <fog_fragment>
}