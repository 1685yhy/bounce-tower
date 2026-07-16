/**
 * 弹弹塔 - Cocos Creator 版
 * 挂载到场景中的 Canvas 节点上
 */
import { _decorator, Component, Node, Graphics, UITransform, Color, Label, input, Input, EventTouch, Vec3, tween, Tween, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Graphics) graphics: Graphics = null!;
    @property(Label) scoreLabel: Label = null!;
    @property(Label) levelLabel: Label = null!;

    private W: number = 375;
    private H: number = 667;
    private BH: number = 28;
    private stack: Block[] = [];
    private curBlock: Block | null = null;
    private status: string = 'idle';
    private score: number = 0;
    private combo: number = 0;
    private levelId: number = 1;
    private levelTarget: number = 2;
    private speedMul: number = 0.5;
    private camY: number = 0;

    onLoad() {
        this.W = this.node.getComponent(UITransform)!.width;
        this.H = this.node.getComponent(UITransform)!.height;
        this.BH = Math.max(24, this.W * 0.08);
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
        this.startLevel(1);
    }

    startLevel(id: number) {
        this.stack = [];
        this.score = 0;
        this.combo = 0;
        this.levelId = id;

        const levels = [
            {id:1, target:2, speed:0.3},{id:2, target:5, speed:1.8},{id:3, target:5, speed:1.4},
            {id:4, target:6, speed:1.6},{id:5, target:6, speed:1.3},{id:6, target:8, speed:1.7},
            {id:7, target:8, speed:1.4},{id:8, target:10, speed:1.8},{id:9, target:10, speed:1.5},
            {id:10, target:12, speed:1.9},{id:11, target:12, speed:1.5},{id:12, target:15, speed:1.9},
            {id:13, target:15, speed:1.6},{id:14, target:18, speed:2.0},{id:15, target:18, speed:1.7},
            {id:16, target:20, speed:2.0},{id:17, target:20, speed:1.7},{id:18, target:24, speed:2.2},
            {id:19, target:24, speed:1.8},{id:20, target:28, speed:2.4},{id:21, target:28, speed:2.0},
            {id:22, target:32, speed:2.5},{id:23, target:32, speed:2.1},{id:24, target:38, speed:2.7},
            {id:25, target:38, speed:2.3},{id:26, target:45, speed:2.8},{id:27, target:45, speed:2.5},
            {id:28, target:55, speed:3.0},{id:29, target:55, speed:2.7},{id:30, target:65, speed:3.5}
        ];

        const lv = levels[id - 1] || levels[0];
        this.levelTarget = lv.target;
        this.speedMul = lv.speed;
        this.status = 'idle';
        this.camY = 0;
        this.updateUI();
        this.spawnBlock();
    }

    getStackTop(): { x: number, y: number, w: number } {
        if (this.stack.length === 0) {
            const w = Math.min(this.W * 0.5, 200);
            return { x: this.W / 2 - w / 2, y: this.H * 0.65, w };
        }
        const t = this.stack[this.stack.length - 1];
        return { x: t.x, y: t.y + this.BH, w: t.w };
    }

    spawnBlock() {
        const t = this.getStackTop();
        const bw = Math.max(30, t.w * (0.4 + Math.random() * 0.8));
        const fromRight = Math.random() < 0.5;
        const speed = (this.W * 0.014 + this.score * this.W * 0.00055 * 2) * this.speedMul * (0.7 + Math.random() * 0.6);

        this.curBlock = {
            x: fromRight ? this.W - bw : 0,
            y: t.y + this.BH + 2,
            w: bw,
            dir: fromRight ? -1 : 1,
            speed,
            color: this.randomColor(),
        };
        this.status = 'playing';
    }

    onTouch() {
        if (this.status === 'playing' && this.curBlock) {
            this.status = 'dropping';
            this.dropBlock();
        } else if (this.status === 'idle') {
            this.spawnBlock();
        }
    }

    dropBlock() {
        if (!this.curBlock) return;
        const t = this.getStackTop();
        const b = this.curBlock;
        const targetY = t.y;

        tween(b)
            .to(0.15, { y: targetY }, { easing: 'bounceOut' })
            .call(() => this.placeBlock())
            .start();
    }

    placeBlock() {
        if (!this.curBlock) return;
        const b = this.curBlock;
        const t = this.getStackTop();

        const overlapL = Math.max(b.x, t.x);
        const overlapR = Math.min(b.x + b.w, t.x + t.w);
        const overlapW = overlapR - overlapL;

        if (overlapW <= 0) {
            this.gameOver();
            return;
        }

        this.stack.push({ x: overlapL, y: t.y, w: overlapW, color: b.color });
        this.score++;
        this.updateUI();

        if (this.score >= this.levelTarget) {
            this.status = 'levelcomplete';
            return;
        }

        this.curBlock = null;
        this.spawnBlock();
    }

    gameOver() {
        this.status = 'gameover';
    }

    update(dt: number) {
        if (this.status === 'playing' && this.curBlock) {
            const b = this.curBlock;
            b.x += b.speed * b.dir * dt * 60;
            if (b.x <= 0 || b.x + b.w >= this.W) b.dir *= -1;
        }
        this.render();
    }

    render() {
        const g = this.graphics;
        g.clear();

        // Background
        g.fillColor = new Color(254, 249, 240);
        g.rect(0, 0, this.W, this.H);
        g.fill();

        // Stack
        for (const b of this.stack) {
            g.fillColor = Color.fromHEX(b.color);
            g.roundRect(b.x, b.y - this.camY, b.w, this.BH, 4);
            g.fill();
        }

        // Current block
        if (this.curBlock) {
            g.fillColor = Color.fromHEX(this.curBlock.color);
            g.roundRect(this.curBlock.x, this.curBlock.y - this.camY, this.curBlock.w, this.BH, 4);
            g.fill();
        }
    }

    updateUI() {
        if (this.scoreLabel) this.scoreLabel.string = String(this.score);
        if (this.levelLabel) this.levelLabel.string = `第${this.levelId}关 · 目标${this.levelTarget}层`;
    }

    randomColor(): string {
        const colors = ['#FF6B6B','#4ECDC4','#A78BFA','#F59E0B','#EC4899','#06B6D4','#84CC16'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

interface Block {
    x: number;
    y: number;
    w: number;
    color: string;
    dir?: number;
    speed?: number;
}
