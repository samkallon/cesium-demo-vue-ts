import models from './model/stylized_ww1_plane/scene.gltf?url'

let pos1 = {
    "x": -2598779.9242094792,
    "y": 4748042.351912904,
    "z": 3362945.4857661366
}
let pos2 = {
    "x": -2619741.8674701173,
    "y": 4727968.131350501,
    "z": 3374862.1299311267
}
let czml:any;
export default czml = [
    {
        id: "document",
        version: "1.0",
        clock: {
            interval: "2018-07-19T15:18:00Z/2018-07-19T15:18:30Z",
            currentTime: "2018-07-19T15:18:00Z",
            // multiplier: 5,
            range: "LOOP_STOP",
            step: "SYSTEM_CLOCK_MULTIPLIER"
        }
    },
    {
        id: "car1",
        model: {
            gltf: models,
            scale: 20,
            minimumPixelSize: 100,
            maximumScale: 200000,
        },
        position: {
            interpolationAlgorithm: "LINEAR",
            forwardExtrapolationType: "HOLD",
            cartesian: [
                "2018-07-19T15:18:00Z", pos1.x, pos1.y, pos1.z,
                "2018-07-19T15:18:30Z", pos2.x, pos2.y, pos2.z
            ]
        }
    },
]
