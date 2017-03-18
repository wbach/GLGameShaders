#version 420

in vec2 TexCoord0;                                                                  
in vec3 Normal0;                                                                    
in vec4 WorldPos0;

layout (location = 0) out vec4 WorldPosOut;
layout (location = 1) out vec4 DiffuseOut;
layout (location = 2) out vec4 NormalOut;   
layout (location = 3) out vec4 SpecularOut; 

layout(binding=0) uniform sampler2D BlendMap ;									
layout(binding=1) uniform sampler2D BackgroundTexture ;
layout(binding=2) uniform sampler2D rTexture ;
layout(binding=3) uniform sampler2D gTexture ;
layout(binding=4) uniform sampler2D bTexture ;
layout(binding=5) uniform sampler2D BackgroundTextureNormal;
layout(binding=6) uniform sampler2D rTextureNormal ;
layout(binding=7) uniform sampler2D gTextureNormal ;
layout(binding=8) uniform sampler2D bTextureNormal ;        
layout(binding=9) uniform sampler2D RockTexture;
layout(binding=10) uniform sampler2D RockTextureNormal;
		
in float Distance;
uniform float ViewDistance;

vec4 CalculateTerrainColor()
{
	vec4 blend_map_colour = texture(BlendMap, TexCoord0) ;
		
	float back_texture_amount = 1 - (blend_map_colour.r + blend_map_colour.g + blend_map_colour.b) ;
	vec2 tiled_coords = TexCoord0 * 40.0f ;

	float normal_y = abs(normalize(Normal0).y);

	normal_y = normal_y *2;

	if (normal_y > 1 ) normal_y = 1;

	vec4 backgorund_texture_colour = texture(BackgroundTexture, tiled_coords) * back_texture_amount * normal_y + ( texture(RockTexture, tiled_coords * 0.5) * back_texture_amount * (1 - normal_y)) ;
	
	vec4 r_texture_colour = texture(rTexture, tiled_coords) * blend_map_colour.r;
	vec4 g_texture_colour = texture(gTexture, tiled_coords) * blend_map_colour.g;
	vec4 b_texture_colour = texture(bTexture, tiled_coords) * blend_map_colour.b;

	return backgorund_texture_colour + r_texture_colour + g_texture_colour + b_texture_colour ;
}
											
void main()									
{	
	//if (Distance > ViewDistance)
	//discard;
	
	WorldPosOut     = WorldPos0;					
	DiffuseOut      = CalculateTerrainColor();	
	NormalOut       = vec4(normalize(Normal0), 1.f); 
	SpecularOut     = vec4(0.f);				
}
