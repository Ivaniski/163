var sphereDFVShader = `
    varying vec3 v_pos;

    void main() {
        v_pos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

var sphereDFFShader = `

    const int MAX_STEPS = 255;
    const float EPSILON = 0.0001;
    const float START = 0.0;
    const float END = 100.0;

    varying vec3 v_pos;
    uniform vec2 resolution;

    float sphereSDF(vec3 pos) {
        return length(pos) - 1.0;
    }

    float shortDistFunct(vec3 cam, vec3 dir, float start, float end) {
        float step = start;

        for(int i = 0; i < MAX_STEPS; i++) {
            float dist = sphereSDF(cam + step * dir);
            if(dist < EPSILON) {
                return step;
            }

            step += dist;
            if(step >= end) {
                return end;
            }
        }

        return end;
    }

    vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
        vec2 xy = fragCoord;
        float z = size.y / tan(radians(fieldOfView) / 2.0);
        return normalize(vec3(xy, -z));
    }

    void main() {

        vec3 cam = vec3(0.0,0.0,5.0);
        vec3 dir = rayDirection(50.0, resolution, v_pos.xy);
        float dist = shortDistFunct(cam, dir, START, END);

        if(dist > END - EPSILON) {
            gl_FragColor = vec4(0.0,0.0,0.0,0.0);
            return;
        }

        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
`;
