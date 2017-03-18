#version 420                                                                               
                                                                                                
// define the number of CPs in the output patch                                                 
layout (vertices = 3) out;                                                                      
                                                                                                
uniform vec3 cameraPosition;                                                                      
                                                                                                
// attributes of the input CPs                                                                  
in vec3 WorldPos_CS_in[];                                                               
in vec2 TexCoord_CS_in[];                                                                       
in vec3 Normal_CS_in[];                                                                         
                                                                                                
// attributes of the output CPs                                                                 
out vec3 WorldPos_ES_in[];                                                                      
out vec2 TexCoord_ES_in[];                                                                      
out vec3 Normal_ES_in[];                                                                        
                                                                                                
float GetTessLevel(float Distance0, float Distance1)                                            
{                                                                                               
    float AvgDistance = (Distance0 + Distance1) / 2.0;        
	return 100.f/(AvgDistance);                                   
      
      if (AvgDistance < 100.f)
      return 10.f;

      if (AvgDistance < 30.f)
      return 9.f;

      if (AvgDistance < 40.f)
      return 8.f;

       if (AvgDistance < 50.f)
      return 7.f;

      return 1.f;///(AvgDistance);

    if (AvgDistance <= 100) {                                                                   
        return 10.0;                                                                            
    }                                                                                           
    else if (AvgDistance <= 200) {                                                              
        return 0.0;                                                                             
    }                                                                                           
    else {                                                                                      
        return 1.0;                                                                             
    }                                                                                           
}                                                                                                
                                                                                                
void main()                                                                                     
{                                                                                               
    // Set the control points of the output patch                                               
    TexCoord_ES_in[gl_InvocationID] = TexCoord_CS_in[gl_InvocationID];                          
    Normal_ES_in[gl_InvocationID]   = Normal_CS_in[gl_InvocationID];                            
    WorldPos_ES_in[gl_InvocationID] = WorldPos_CS_in[gl_InvocationID];                          
                                                                                                
    // Calculate the distance from the camera to the three control points                       
    float EyeToVertexDistance0 = distance(cameraPosition, WorldPos_ES_in[0]);                     
    float EyeToVertexDistance1 = distance(cameraPosition, WorldPos_ES_in[1]);                     
    float EyeToVertexDistance2 = distance(cameraPosition, WorldPos_ES_in[2]);                     
                                                                                                
    // Calculate the tessellation levels                                                        
    gl_TessLevelOuter[0] = GetTessLevel(EyeToVertexDistance1, EyeToVertexDistance2);            
    gl_TessLevelOuter[1] = GetTessLevel(EyeToVertexDistance2, EyeToVertexDistance0);            
    gl_TessLevelOuter[2] = GetTessLevel(EyeToVertexDistance0, EyeToVertexDistance1);            
    gl_TessLevelInner[0] = gl_TessLevelOuter[2];                                                
}                                                                                               
