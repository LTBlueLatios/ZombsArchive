import { Player } from "./EntityClasses/Player.js";
import { Resource } from "./EntityClasses/Resource.js";
import { ArrowTower } from "./EntityClasses/ArrowTower.js";
import { MageTower } from "./EntityClasses/MageTower.js";
import { Factory } from "./EntityClasses/Factory.js";
import { Wall } from "./EntityClasses/Wall.js";
import { LargeWall } from "./EntityClasses/LargeWall.js";
import { Door } from "./EntityClasses/Door.js";
import { SpikeTrap } from "./EntityClasses/SpikeTrap.js";
import { Projectile } from "./EntityClasses/Projectile.js";
import { DynamiteProjectile } from "./EntityClasses/DynamiteProjectile.js";
import { RocketProjectile } from "./EntityClasses/RocketProjectile.js";
import { CannonTower } from "./EntityClasses/CannonTower.js";
import { RocketTower } from "./EntityClasses/RocketTower.js";
import { Drill } from "./EntityClasses/Drill.js";
import { SawTower } from "./EntityClasses/SawTower.js";
import { LightningTower } from "./EntityClasses/LightningTower.js";
import { Harvester } from "./EntityClasses/Harvester.js";
import { HarvesterDrone } from "./EntityClasses/HarvesterDrone.js";
import { Zombie } from "./EntityClasses/Zombie.js";
import { SpellIndicator } from "./EntityClasses/SpellIndicator.js";
import { ResourcePickup } from "./EntityClasses/ResourcePickup.js";
import { Visualiser } from "./EntityClasses/Visualiser.js";

let classes = {
    Player: Player,
    Resource: Resource,
    ArrowTower: ArrowTower,
    MageTower: MageTower,
    Factory: Factory,
    Projectile: Projectile,
    Harvester: Harvester,
    HarvesterDrone: HarvesterDrone,
    DynamiteProjectile: DynamiteProjectile,
    RocketProjectile: RocketProjectile,
    Wall: Wall,
    LargeWall: LargeWall,
    Door: Door,
    SpikeTrap: SpikeTrap,
    CannonTower: CannonTower,
    RocketTower: RocketTower,
    Drill: Drill,
    SawTower: SawTower,
    LightningTower: LightningTower,
    Zombie: Zombie,
    SpellIndicator: SpellIndicator,
    ResourcePickup: ResourcePickup,
    Visualiser: Visualiser
};

export { classes as entities };