import * as THREE from "three";

// A full beard for the avatar: a copy of his head mesh, pushed slightly out,
// that a shader trims to the jaw, cheeks and chin (leaving the mouth clear).
// It shares the head's skeleton, so it moves with every animation.

const COLOR = "#120d0b";
// Head centre in the model's bind pose, and the scale into the shader's units.
const CENTER = new THREE.Vector3(0, 12.95, 0.05);
const SCALE = 0.55;

const MASK = `
varying vec3 vFace;
float beardMask(vec3 p){
  float ax = abs(p.x);
  float cheek = -0.02 - 0.34*pow(max(1.0 - ax/0.52, 0.0), 1.15);
  float e = cheek - p.y;
  float centre = -0.375 - p.y;
  e = mix(e, centre, 1.0 - smoothstep(0.15, 0.21, ax));
  float mouth = length(vec2(p.x/0.155, (p.y + 0.305)/0.082));
  e = min(e, (mouth - 1.0)*0.05);
  e = min(e, (p.z + 0.1)*0.5);
  return e;
}
`;

export const makeBeard = (head: THREE.SkinnedMesh) => {
  const geo = head.geometry.clone();
  geo.deleteAttribute("color");
  geo.computeVertexNormals();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const d = 0.03;
    pos.setXYZ(i, pos.getX(i) + nor.getX(i) * d, pos.getY(i) + nor.getY(i) * d, pos.getZ(i) + nor.getZ(i) * d);
  }

  const material = new THREE.MeshStandardMaterial({
    color: COLOR,
    roughness: 0.82,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  material.alphaToCoverage = true;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCenter = { value: CENTER };
    shader.uniforms.uScale = { value: SCALE };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vFace;\nuniform vec3 uCenter;\nuniform float uScale;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFace = (position - uCenter) * uScale;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${MASK}`)
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
  diffuseColor.a = clamp(beardMask(vFace) / 0.02, 0.0, 1.0);
  if (diffuseColor.a < 0.02) discard;`
      );
  };
  material.customProgramCacheKey = () => "avatar-beard";

  const beard = new THREE.SkinnedMesh(geo, material);
  beard.bind(head.skeleton, head.bindMatrix);
  beard.frustumCulled = false;
  beard.name = "beard";
  return beard;
};
