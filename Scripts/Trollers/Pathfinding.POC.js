!function (t) {
    if ("object" == typeof exports) module.exports = t();
    else if ("function" == typeof define && define.amd) define(t);
    else {
        var e;
        "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self),
            e.PF = t()
    }
}(function () {
    return function t(e, i, n) {
        function o(a, s) {
            if (!i[a]) {
                if (!e[a]) {
                    var l = "function" == typeof require && require;
                    if (!s && l) return l(a, !0);
                    if (r) return r(a, !0);
                    throw new Error("Cannot find module '" + a + "'")
                }
                var h = i[a] = {
                    exports: {}
                };
                e[a][0].call(h.exports, function (t) {
                    var i = e[a][1][t];
                    return o(i ? i : t)
                }, h, h.exports, t, e, i, n)
            }
            return i[a].exports
        }
        for (var r = "function" == typeof require && require, a = 0; a < n.length; a++) o(n[a]);
        return o
    }({
        1: [function (t, e, i) {
            e.exports = t("./lib/heap")
        }
            , {
            "./lib/heap": 2
        }],
        2: [function (t, e, i) {
            (function () {
                var t, i, n, o, r, a, s, l, h, u, p, c, f, d, g;
                n = Math.floor,
                    u = Math.min,
                    i = function (t, e) {
                        return e > t ? -1 : t > e ? 1 : 0
                    },
                    h = function (t, e, o, r, a) {
                        var s;
                        if (null == o && (o = 0), null == a && (a = i), 0 > o) throw new Error("lo must be non-negative");
                        for (null == r && (r = t.length); r > o;) s = n((o + r) / 2), a(e, t[s]) < 0 ? r = s : o = s + 1;
                        return [].splice.apply(t, [o, o - o].concat(e)), e
                    },
                    a = function (t, e, n) {
                        return null == n && (n = i),
                            t.push(e),
                            d(t, 0, t.length - 1, n)
                    },
                    r = function (t, e) {
                        var n, o;
                        return null == e && (e = i),
                            n = t.pop(),
                            t.length ? (o = t[0],
                                t[0] = n,
                                g(t, 0, e)) : o = n, o
                    },
                    l = function (t, e, n) {
                        var o;
                        return null == n && (n = i),
                            o = t[0],
                            t[0] = e,
                            g(t, 0, n), o
                    },
                    s = function (t, e, n) {
                        var o;
                        return null == n && (n = i),
                            t.length && n(t[0], e) < 0 && (o = [t[0], e],
                                e = o[0],
                                t[0] = o[1],
                                g(t, 0, n)), e
                    },
                    o = function (t, e) {
                        var o, r, a, s, l, h;
                        for (null == e && (e = i), s = function () {
                            h = [];
                            for (var e = 0, i = n(t.length / 2); i >= 0 ? i > e : e > i; i >= 0 ? e++ : e--) h.push(e);
                            return h
                        }.apply(this).reverse(), l = [], r = 0, a = s.length; a > r; r++) o = s[r], l.push(g(t, o, e));
                        return l
                    },
                    f = function (t, e, n) {
                        var o;
                        return null == n && (n = i),
                            o = t.indexOf(e),
                            -1 !== o ? (d(t, 0, o, n),
                                g(t, o, n)) : void 0
                    },
                    p = function (t, e, n) {
                        var r, a, l, h, u;
                        if (null == n && (n = i), a = t.slice(0, e), !a.length) return a;
                        for (o(a, n), u = t.slice(e), l = 0, h = u.length; h > l; l++) r = u[l], s(a, r, n);
                        return a.sort(n).reverse()
                    },
                    c = function (t, e, n) {
                        var a, s, l, p, c, f, d, g, b, v;
                        if (null == n && (n = i), 10 * e <= t.length) {
                            if (p = t.slice(0, e).sort(n), !p.length) return p;
                            for (l = p[p.length - 1], g = t.slice(e), c = 0, d = g.length; d > c; c++)
                                a = g[c], n(a, l) < 0 && (h(p, a, 0, null, n), p.pop(), l = p[p.length - 1]);
                            return p
                        }
                        for (o(t, n), v = [], s = f = 0, b = u(e, t.length); b >= 0 ? b > f : f > b; s = b >= 0 ? ++f : --f) v.push(r(t, n));
                        return v
                    },
                    d = function (t, e, n, o) {
                        var r, a, s;
                        for (null == o && (o = i), r = t[n]; n > e && (s = n - 1 >> 1, a = t[s], o(r, a) < 0);) t[n] = a, n = s;
                        return t[n] = r
                    },
                    g = function (t, e, n) {
                        var o, r, a, s, l;
                        for (null == n && (n = i), r = t.length, l = e, a = t[e], o = 2 * e + 1; r > o;)
                            s = o + 1,
                                r > s && !(n(t[o], t[s]) < 0) && (o = s),
                                t[e] = t[o],
                                e = o, o = 2 * e + 1;
                        return t[e] = a, d(t, l, e, n)
                    },
                    t = function () {
                        function t(t) {
                            this.cmp = null != t ? t : i,
                                this.nodes = []
                        }
                        return t.push = a,
                            t.pop = r,
                            t.replace = l,
                            t.pushpop = s,
                            t.heapify = o,
                            t.updateItem = f,
                            t.nlargest = p,
                            t.nsmallest = c,
                            t.prototype.push = function (t) {
                                return a(this.nodes, t, this.cmp)
                            },
                            t.prototype.pop = function () {
                                return r(this.nodes, this.cmp)
                            },
                            t.prototype.peek = function () {
                                return this.nodes[0]
                            },
                            t.prototype.contains = function (t) {
                                return -1 !== this.nodes.indexOf(t)
                            },
                            t.prototype.replace = function (t) {
                                return l(this.nodes, t, this.cmp)
                            },
                            t.prototype.pushpop = function (t) {
                                return s(this.nodes, t, this.cmp)
                            },
                            t.prototype.heapify = function () {
                                return o(this.nodes, this.cmp)
                            },
                            t.prototype.updateItem = function (t) {
                                return f(this.nodes, t, this.cmp)
                            },
                            t.prototype.clear = function () {
                                return this.nodes = []
                            },
                            t.prototype.empty = function () {
                                return 0 === this.nodes.length
                            },
                            t.prototype.size = function () {
                                return this.nodes.length
                            },
                            t.prototype.clone = function () {
                                var e;
                                return e = new t, e.nodes = this.nodes.slice(0), e
                            },
                            t.prototype.toArray = function () {
                                return this.nodes.slice(0)
                            },
                            t.prototype.insert = t.prototype.push,
                            t.prototype.top = t.prototype.peek,
                            t.prototype.front = t.prototype.peek,
                            t.prototype.has = t.prototype.contains,
                            t.prototype.copy = t.prototype.clone,
                            t
                    }(),
                    ("undefined" != typeof e && null !== e ? e.exports : void 0) ? e.exports = t : window.Heap = t
            }).call(this)
        }
            , {}],
        3: [function (t, e, i) {
            var n = {
                Always: 1,
                Never: 2,
                IfAtMostOneObstacle: 3,
                OnlyWhenNoObstacles: 4
            };
            e.exports = n
        }
            , {}],
        4: [function (t, e, i) {
            function n(t, e, i) {
                var n;
                "object" != typeof t ? n = t : (e = t.length,
                    n = t[0].length,
                    i = t),
                    this.width = n,
                    this.height = e,
                    this.nodes = this._buildNodes(n, e, i)
            }
            var o = t("./Node")
                , r = t("./DiagonalMovement");
            n.prototype._buildNodes = function (t, e, i) {
                var n, r, a = new Array(e);
                for (n = 0; e > n; ++n)
                    for (a[n] = new Array(t),
                        r = 0; t > r; ++r)
                        a[n][r] = new o(r, n);
                if (void 0 === i)
                    return a;
                if (i.length !== e || i[0].length !== t)
                    throw new Error("Matrix size does not fit");
                for (n = 0; e > n; ++n)
                    for (r = 0; t > r; ++r)
                        i[n][r] && (a[n][r].walkable = !1);
                return a
            },
                n.prototype.getNodeAt = function (t, e) {
                    return this.nodes[e][t]
                },
                n.prototype.isWalkableAt = function (t, e) {
                    return this.isInside(t, e) && this.nodes[e][t].walkable
                },
                n.prototype.isInside = function (t, e) {
                    return t >= 0 && t < this.width && e >= 0 && e < this.height
                },
                n.prototype.setWalkableAt = function (t, e, i) {
                    this.nodes[e][t].walkable = i
                },
                n.prototype.getNeighbors = function (t, e) {
                    var i = t.x
                        , n = t.y
                        , o = []
                        , a = !1
                        , s = !1
                        , l = !1
                        , h = !1
                        , u = !1
                        , p = !1
                        , c = !1
                        , f = !1
                        , d = this.nodes;
                    if (this.isWalkableAt(i, n - 1) && (o.push(d[n - 1][i]),
                        a = !0),
                        this.isWalkableAt(i + 1, n) && (o.push(d[n][i + 1]),
                            l = !0),
                        this.isWalkableAt(i, n + 1) && (o.push(d[n + 1][i]),
                            u = !0),
                        this.isWalkableAt(i - 1, n) && (o.push(d[n][i - 1]),
                            c = !0),
                        e === r.Never)
                        return o;
                    if (e === r.OnlyWhenNoObstacles)
                        s = c && a,
                            h = a && l,
                            p = l && u,
                            f = u && c;
                    else if (e === r.IfAtMostOneObstacle)
                        s = c || a,
                            h = a || l,
                            p = l || u,
                            f = u || c;
                    else {
                        if (e !== r.Always)
                            throw new Error("Incorrect value of diagonalMovement");
                        s = !0,
                            h = !0,
                            p = !0,
                            f = !0
                    }
                    return s && this.isWalkableAt(i - 1, n - 1) && o.push(d[n - 1][i - 1]),
                        h && this.isWalkableAt(i + 1, n - 1) && o.push(d[n - 1][i + 1]),
                        p && this.isWalkableAt(i + 1, n + 1) && o.push(d[n + 1][i + 1]),
                        f && this.isWalkableAt(i - 1, n + 1) && o.push(d[n + 1][i - 1]),
                        o
                },
                n.prototype.clone = function () {
                    var t, e, i = this.width, r = this.height, a = this.nodes, s = new n(i, r), l = new Array(r);
                    for (t = 0; r > t; ++t)
                        for (l[t] = new Array(i), e = 0; i > e; ++e) l[t][e] = new o(e, t, a[t][e].walkable);
                    return s.nodes = l,
                        s
                },
                e.exports = n
        }
            , {
            "./DiagonalMovement": 3,
            "./Node": 6
        }],
        5: [function (t, e, i) {
            e.exports = {
                manhattan: function (t, e) {
                    return t + e
                },
                euclidean: function (t, e) {
                    return Math.sqrt(t * t + e * e)
                },
                octile: function (t, e) {
                    return Math.min(t, e) * Math.sqrt(2) + Math.abs(t - e)
                },
                chebyshev: function (t, e) {
                    return Math.max(t, e)
                }
            }
        }
            , {}],
        6: [function (t, e, i) {
            function n(t, e, i) {
                this.x = t,
                    this.y = e,
                    this.walkable = void 0 === i ? !0 : i
            }
            e.exports = n
        }
            , {}],
        7: [function (t, e, i) {
            function n(t) {
                for (var e = [[t.x, t.y]]; t.parent;) t = t.parent, e.push([t.x, t.y]);
                return e.reverse()
            }
            function o(t, e) {
                var i = n(t), o = n(e);
                return i.concat(o.reverse())
            }
            function r(t) {
                var e, i, n, o, r, a = 0;
                for (e = 1; e < t.length; ++e)
                    i = t[e - 1],
                        n = t[e],
                        o = i[0] - n[0],
                        r = i[1] - n[1],
                        a += Math.sqrt(o * o + r * r);
                return a
            }
            function a(t, e, i, n) {
                var o, r, a, s, l, h, u = Math.abs, p = [];
                for (a = u(i - t), s = u(n - e), o = i > t ? 1 : -1, r = n > e ? 1 : -1, l = a - s; ;) {
                    if (p.push([t, e]), t === i && e === n) break;
                    h = 2 * l,
                        h > -s && (l -= s,
                            t += o),
                        a > h && (l += a, e += r)
                }
                return p
            }
            function s(t) {
                var e, i, n, o, r, s, l = [], h = t.length;
                if (2 > h) return l;
                for (r = 0; h - 1 > r; ++r)
                    for (e = t[r], i = t[r + 1], n = a(e[0], e[1], i[0], i[1]), o = n.length, s = 0; o - 1 > s; ++s) l.push(n[s]);
                return l.push(t[h - 1]), l
            }
            function l(t, e) {
                var i, n, o, r, s, l, h, u, p, c, f, d = e.length, g = e[0][0], b = e[0][1], v = e[d - 1][0], A = e[d - 1][1];
                for (i = g, n = b, s = [[i, n]], l = 2; d > l; ++l) {
                    for (u = e[l], o = u[0], r = u[1], p = a(i, n, o, r), f = !1, h = 1; h < p.length; ++h)
                        if (c = p[h], !t.isWalkableAt(c[0], c[1])) {
                            f = !0;
                            break
                        }
                    f && (lastValidCoord = e[l - 1],
                        s.push(lastValidCoord),
                        i = lastValidCoord[0],
                        n = lastValidCoord[1])
                }
                return s.push([v, A]), s
            }
            function h(t) {
                if (t.length < 3) return t;
                var e, i, n, o, r, a, s = [], l = t[0][0], h = t[0][1], u = t[1][0], p = t[1][1], c = u - l, f = p - h;
                for (r = Math.sqrt(c * c + f * f), c /= r, f /= r, s.push([l, h]), a = 2; a < t.length; a++)
                    e = u,
                        i = p,
                        n = c,
                        o = f,
                        u = t[a][0],
                        p = t[a][1],
                        c = u - e,
                        f = p - i,
                        r = Math.sqrt(c * c + f * f),
                        c /= r,
                        f /= r,
                        c === n && f === o || s.push([e, i]);
                return s.push([u, p]),
                    s
            }
            i.backtrace = n,
                i.biBacktrace = o,
                i.pathLength = r,
                i.interpolate = a,
                i.expandPath = s,
                i.smoothenPath = l,
                i.compressPath = h
        }
            , {}],
        8: [function (t, e, i) {
            e.exports = {
                Heap: t("heap"),
                Node: t("./core/Node"),
                Grid: t("./core/Grid"),
                Util: t("./core/Util"),
                DiagonalMovement: t("./core/DiagonalMovement"),
                Heuristic: t("./core/Heuristic"),
                AStarFinder: t("./finders/AStarFinder"),
            }
        }
            , {
            "./core/DiagonalMovement": 3,
            "./core/Grid": 4,
            "./core/Heuristic": 5,
            "./core/Node": 6,
            "./core/Util": 7,
            "./finders/AStarFinder": 9,
            heap: 1
        }],
        9: [function (t, e, i) {
            function n(t) {
                t = t || {},
                    this.allowDiagonal = t.allowDiagonal,
                    this.dontCrossCorners = t.dontCrossCorners,
                    this.heuristic = t.heuristic || a.manhattan,
                    this.weight = t.weight || 1,
                    this.diagonalMovement = t.diagonalMovement,
                    this.diagonalMovement || (this.allowDiagonal ? this.dontCrossCorners ? this.diagonalMovement = s.OnlyWhenNoObstacles : this.diagonalMovement = s.IfAtMostOneObstacle : this.diagonalMovement = s.Never),
                    this.diagonalMovement === s.Never ? this.heuristic = t.heuristic || a.manhattan : this.heuristic = t.heuristic || a.octile
            }
            var o = t("heap")
                , r = t("../core/Util")
                , a = t("../core/Heuristic")
                , s = t("../core/DiagonalMovement");
            n.prototype.findPath = function (t, e, i, n, a) {
                var s, l, h, u, p, c, f, d, g = new o(function (t, e) {
                    return t.f - e.f
                }),
                    b = a.getNodeAt(t, e), v = a.getNodeAt(i, n), A = this.heuristic, m = this.diagonalMovement, y = this.weight, k = Math.abs, M = Math.SQRT2;
                for (b.g = 0, b.f = 0, g.push(b), b.opened = !0; !g.empty();) {
                    if (s = g.pop(), s.closed = !0, s === v) return r.backtrace(v);
                    for (l = a.getNeighbors(s, m), u = 0, p = l.length; p > u; ++u)
                        h = l[u],
                            h.closed || (c = h.x, f = h.y, d = s.g + (c - s.x === 0 || f - s.y === 0 ? 1 : M),
                                (!h.opened || d < h.g) && (h.g = d, h.h = h.h || y * A(k(c - i), k(f - n)),
                                    h.f = h.g + h.h, h.parent = s, h.opened ? g.updateItem(h) : (g.push(h), h.opened = !0)))
                }
                return []
            },
                e.exports = n
        }, {
            "../core/DiagonalMovement": 3,
            "../core/Heuristic": 5,
            "../core/Util": 7,
            heap: 1
        }]
    }, {}, [8])(8)
});

let allowProjectiles = false;
let allowZombies = true;

const map = new Array(250000);

for (let i = 0; i < 250000; i++) {
    map[i] = new Set();
}

const getCellIndex = (x, y) => {
    return ~~(x / 48) + ~~(y / 48) * 500;
}

const getCellIndexes = (x, y, size) => {
    const indexes = [];
    for (let offsetX = -size / 2 + 0.5; offsetX < size / 2; offsetX++) {
        for (let offsetY = -size / 2 + 0.5; offsetY < size / 2; offsetY++) {
            const index = getCellIndex(x + offsetX * 48, y + offsetY * 48);
            (index >= 0 && index < 250000) ? indexes.push(index) : indexes.push(undefined);
        }
    }
    return indexes;
}

const removeEntityFromCells = (uid, indexes) => {
    if (indexes) {
        for (let i = 0; i < indexes.length; i++) {
            !isNaN(indexes[i]) && map[indexes[i]].delete(uid);
        }
    }
};

const addEntityToCells = (uid, indexes) => {
    if (indexes) {
        for (let i = 0; i < indexes.length; i++) {
            !isNaN(indexes[i]) && map[indexes[i]].add(uid);
        }
    }
};

const detectSize = (model) => {
    if (model.startsWith("Zombie")) return 3;
    return (({
        "Tree": 4,
        "Stone": 3,
        "NeutralCamp": 3,
        "ArrowTower": 2,
        "CannonTower": 2,
        "MeleeTower": 2,
        "BombTower": 2,
        "MagicTower": 2,
        "GoldMine": 2,
        "Harvester": 2,
        "GoldStash": 2
    })[model] || 1);
}

const entities = {};

if (game.world.entities[game.world.myUid]) {
    for (const i in game.world.entities) {
        const tick = game.world.entities[i].targetTick;
        if ((allowProjectiles || tick.entityClass != "Projectile") && (allowZombies || tick.model.startsWith("Zombie") != true)) {
            const size = detectSize(tick.model);
            const indexes = getCellIndexes(tick.position.x, tick.position.y, size);
            entities[i] = { uid: i, model: tick.model, size: size, partyId: tick.partyId || 0, targetTick: { position: tick.position } };
            addEntityToCells(i, indexes);
        }
    }
}

game.network.addEntityUpdateHandler((data) => {
    for (const i in data.entities) {
        const tick = data.entities[i];
        if (!entities[i]) {
            if (tick.entityClass && (allowProjectiles || tick.entityClass != "Projectile") && (allowZombies || tick.model.startsWith("Zombie") != true)) {
                const size = detectSize(tick.model);
                const indexes = getCellIndexes(tick.position.x, tick.position.y, size);
                entities[i] = { uid: i, model: tick.model, size: size, partyId: tick.partyId || 0, targetTick: { position: tick.position } };
                addEntityToCells(i, indexes);
            }
        } else {
            if (tick.position) {
                const entity = entities[i];
                const oldIndexes = getCellIndexes(entity.targetTick.position.x, entity.targetTick.position.y, entity.size);
                const newIndexes = getCellIndexes(tick.position.x, tick.position.y, entity.size);
                removeEntityFromCells(i, oldIndexes);
                addEntityToCells(i, newIndexes);
                entity.targetTick.position = tick.position;
            }
        }
    }
    for (const i in entities) {
        if (!data.entities[i]) {
            const entity = entities[i];
            const indexes = getCellIndexes(entity.targetTick.position.x, entity.targetTick.position.y, entity.size);
            removeEntityFromCells(i, indexes);
            delete entities[i];
        }
    }
});

const generateMatrix = () => {
    const matrix = [];

    const px = ~~(entities[game.world.myUid].targetTick.position.x / 48);
    const py = ~~(entities[game.world.myUid].targetTick.position.y / 48);
    const ppid = entities[game.world.myUid].partyId;

    for (let y = Math.max(0, py - 24); y < Math.min(500, py + 24); y++) {
        const col = [];
        for (let x = Math.max(0, px - 30); x < Math.min(500, px + 30); x++) {
            const set = map[getCellIndex(x * 48, y * 48)];
            if (set.size == 0) {
                col.push(0);
            } else if (set.size == 1) {
                set.forEach(i => {
                    const entity = entities[i];
                    if (entity.model == "SlowTrap" || (entity.model == "Door" && entity.partyId == ppid)) {
                        col.push(0);
                    } else {
                        col.push(1);
                    }
                });
            } else {
                col.push(1);
            }
        }
        matrix.push(col);
    }
    return matrix;
}

const graphics = [];

function moveThroughPath(path) {
    let currentIndex = 0;

    function moveNext() {
        if (currentIndex >= path.length - 1) {
            console.log("Reached the end of the path.");
            return;
        }

        const currentPos = path[currentIndex];
        const nextPos = path[currentIndex + 1];

        let up = 0, down = 0, left = 0, right = 0;

        if (nextPos[0] > currentPos[0]) {
            right = 1;
        } else if (nextPos[0] < currentPos[0]) {
            left = 1;
        }

        if (nextPos[1] > currentPos[1]) {
            down = 1;
        } else if (nextPos[1] < currentPos[1]) {
            up = 1;
        }

        game.network.sendInput({ up, down, left, right });

        currentIndex++;
    }

    moveNext();

    const interval = setInterval(() => {
        moveNext();
        if (currentIndex >= path.length - 1) {
            clearInterval(interval);
        }
    }, 1000);
}

setInterval(() => {
    if (!entities[game.world.myUid]) return;
    graphics.forEach(e => e.destroy());
    graphics.length = 0;

    const playerpos = entities[game.world.myUid].targetTick.position;
    const mousepos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);

    const px = ~~(playerpos.x / 48);
    const py = ~~(playerpos.y / 48);

    const p2x = ~~(mousepos.x / 48);
    const p2y = ~~(mousepos.y / 48);

    const matrix = generateMatrix();

    const startx = Math.min(px + Math.max(0, px - 30), 30);
    const starty = Math.min(py + Math.max(0, py - 24), 24);

    const endx = Math.max(0, Math.min(p2x - px + startx, matrix[0].length - 1));
    const endy = Math.max(0, Math.min(p2y - py + starty, matrix.length - 1));

    if (matrix[endy] != undefined && matrix[endy][endx] != undefined) {
        const grid = new PF.Grid(matrix);

        const finder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true,
            heuristic: PF.Heuristic.chebyshev
        });

        const path = finder.findPath(startx, starty, endx, endy, grid);
        moveThroughPath(path);

        for (let i = 0; i < path.length - 1; i++) {
            const line = new PIXI.Graphics();
            line.lineStyle(8, 0x99FFFF);
            line.moveTo((path[i][0] - startx + px) * 48 + 24, (path[i][1] - starty + py) * 48 + 24);
            line.lineTo((path[i + 1][0] - startx + px) * 48 + 24, (path[i + 1][1] - starty + py) * 48 + 24);
            game.world.renderer.entities.node.addChild(line);
            graphics.push(line);
        }
    }
}, 1000);