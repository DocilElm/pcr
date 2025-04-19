import Location from "../tska/skyblock/Location"
import { LocalStore } from "../tska/storage/LocalStore"

const data = new LocalStore("PrioritizeRightClick", {
    toggle: false,
    firstInstall: true
})
const prefix = "&7[&bPRC&7]"
const rightClick = new KeyBind(Client.getMinecraft().field_71474_y.field_74313_G)
const allowedIDs = new Set(["e0f3e929-869e-3dca-9504-54c666ee6f23", "fed95410-aba1-39df-9b95-1d4f361eb66e"])
const secretBlocks = new Set(["minecraft:chest", "minecraft:lever", "minecraft:skull", "minecraft:trapped_chest"])

const checkSkullTexture = (bp) => allowedIDs.has(World.getWorld()?.func_175625_s(bp)?.func_152108_a()?.id?.toString())

const reg = register("hitBlock", (block, event) => {
    if (!Location.inWorld("catacombs")) return

    /** @type {Block} */
    const lookingAt = Player.lookingAt()
    if (!lookingAt.type) return
    if (!rightClick.isKeyDown()) return

    const registry = lookingAt.type.getRegistryName()
    if (!secretBlocks.has(registry) || registry === "minecraft:skull" && !checkSkullTexture(block.pos.toMCBlock())) return

    cancel(event)
}).unregister()

if (data.toggle) reg.register()

const a = register("step", () => {
    if (!World.isLoaded()) return
    if (!data.firstInstall) return a.unregister()

    ChatLib.chat(`${prefix} &b/pcr command to &cdisable&b/&aenable &bthe feature`)
    data.firstInstall = false
})

if (!data.firstInstall) a.unregister()

register("command", () => {
    data.toggle = !data.toggle
    if (data.toggle) reg.register()
    else reg.unregister()

    ChatLib.chat(`${prefix} ${data.toggle ? "&aEnabled" : "&cDisabled"}`)
}).setName("pcr")