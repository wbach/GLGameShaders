#version 420 core                                                                               

layout(triangles, equal_spacing, ccw) in;

uniform mat4 ProjectionMatrix;
uniform mat4 ViewMatrix;

layout(binding=11) uniform sampler2D gDisplacementMap;
uniform float gDispFactor;

in vec3 WorldPos_ES_in[];
in vec2 TexCoord_ES_in[];
in vec3 Normal_ES_in[];

out vec2 TexCoord0;                                                                  
out vec3 Normal0;                                                                    
out vec4 WorldPos0;

vec2 interpolate2D(vec2 v0, vec2 v1, vec2 v2)
{
    return vec2(gl_TessCoord.x) * v0 + vec2(gl_TessCoord.y) * v1 + vec2(gl_TessCoord.z) * v2;
}

vec3 interpolate3D(vec3 v0, vec3 v1, vec3 v2)
{
    return vec3(gl_TessCoord.x) * v0 + vec3(gl_TessCoord.y) * v1 + vec3(gl_TessCoord.z) * v2;   
}                                                                                               
                                                                                                
void main()                                                                                     
{         
    mat4 gVP =  ProjectionMatrix * ViewMatrix;                                
    // Interpolate the attributes of the output vertex using the barycentric coordinates        
    TexCoord0 = interpolate2D(TexCoord_ES_in[0], TexCoord_ES_in[1], TexCoord_ES_in[2]);    
    Normal0 = interpolate3D(Normal_ES_in[0], Normal_ES_in[1], Normal_ES_in[2]);            
    Normal0 = normalize(Normal0);                                                     
    WorldPos0 = vec4(interpolate3D(WorldPos_ES_in[0], WorldPos_ES_in[1], WorldPos_ES_in[2]), 1.0);    
                                                                                                
    // Displace the vertex along the normal                                                     
    float Displacement = 2.f * texture(gDisplacementMap, TexCoord0.xy).x - 1.f;                        
    WorldPos0 += vec4(Normal0 * Displacement * gDispFactor, 0.f);                                
    gl_Position = gVP * WorldPos0;                                              
}                                                                                               
