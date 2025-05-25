const DirectionMapper = {
    yawActions: {
        90: { right: 1, left: 0, up: 0, down: 0 },
        225: { down: 1, left: 1, up: 0, right: 0 },
        44: { down: 0, left: 0, up: 1, right: 1 },
        314: { down: 0, left: 1, up: 1, right: 0 },
        135: { down: 1, left: 0, up: 0, right: 1 },
        359: { up: 1, down: 0, right: 0, left: 0 },
        180: { down: 1, up: 0, right: 0, left: 0 },
        270: { left: 1, right: 0, up: 0, down: 0 }
    },
    precomputedYaw: {},
    typeToValue: {
        "top": 359,
        "top right": 44,
        "right": 90,
        "bottom right": 135,
        "bottom": 180,
        "bottom left": 225,
        "left": 270,
        "top left": 314
    },
    init() {
        const tolerance = 22.5;
        for (let num = 0; num < 360; num++) {
            let closestAngle = null;
            let minDifference = Infinity;
            for (const angle in this.yawActions) {
                const yawAngle = parseInt(angle);
                const difference = Math.min(
                    Math.abs(num - yawAngle),
                    Math.abs(num + 360 - yawAngle),
                    Math.abs(num - 360 - yawAngle)
                );
                if (difference <= tolerance && difference < minDifference) {
                    closestAngle = yawAngle;
                    minDifference = difference;
                }
            }
            this.precomputedYaw[num] = closestAngle;
        }
    },
    aimToYaw(num, reverseYaw = false) {
        let matchingMovement = this.precomputedYaw[num];
        if (reverseYaw && matchingMovement !== null) {
            matchingMovement = (matchingMovement + 180) % 360;
        }
        return matchingMovement;
    }
};

DirectionMapper.init();
export default DirectionMapper;
