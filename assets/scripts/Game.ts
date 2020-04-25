// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property({displayName: '播放速度'})
    speed: number = 0; // 移动时控制速度的变量
    @property({displayName: '播放方向0横1竖'})
    orient: number = 0;// 0横 1竖
    @property( {displayName: '背景图', type: cc.Node})
    bgArr: cc.Node[] = []; // 用于管理背景图片结点的数组,记得回cocos面板中添加数组的结点数量
    
    curBg: cc.Node = null;// 当前播放背景
    nextBg: cc.Node = null;// 即将播放背景
    curIndex: number = 0;// 当前播放背景索引
    xy:string = 'x';// x | y
    wh:string = 'w';// 宽高
    // 是否可以播放
    move:boolean = true;

    start () {
        if (this.bgArr.length == 0) {
            this.move = false;
            return;
        }

        // 如果只有一张背景图，则克隆一个
        if (this.bgArr.length == 1) {
            this.bgArr[1] = cc.instantiate(this.bgArr[0]);
            this.bgArr[0].parent.addChild(this.bgArr[1]);
        }
       
        this.xy = this.orient == 0 ? 'x' : 'y';
        this.wh = this.orient == 0 ? 'width' : 'height';

        this.curBg = this.bgArr[this.curIndex];
        this.nextBg = this.bgArr[this.curIndex + 1];

        // 设置背景图坐标
        this.setBgPosition();
    }
    /**
     * 设置背景图坐标
     */
    setBgPosition () {
        
        this.bgArr[this.curIndex][this.xy] = 0;
        this.bgArr[this.curIndex + 1][this.xy] = - (this.curBg[this.wh] / 2 + this.nextBg[this.wh] / 2);
    }

    update (dt) {
        this.bgMove();
    }

    /**
     * 
     * @param bgList 
     * @param speed 速度
     */
    bgMove() {
        if (this.move) {
            this.curBg[this.xy] += this.speed;
            this.nextBg[this.xy] += this.speed;

            // 当前背景图已播放完
            if(this.curBg[this.xy] >= this.curBg[this.wh]) {
                this.curBg = this.nextBg;
                this.nextBg = this.bgArr[this.curIndex ++ % this.bgArr.length];
                this.nextBg[this.xy] = this.curBg[this.xy] - this.curBg[this.wh] / 2 - this.nextBg[this.wh] / 2;
            }
        }
    }
}
