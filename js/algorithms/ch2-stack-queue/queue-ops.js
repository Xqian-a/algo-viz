import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch2-queue-ops',
  name: '队列操作',
  nameEn: 'Queue Operations',
  chapter: 'ch2-stack-queue',
  chapterName: '栈和队列',
  description: '队列是先进先出(FIFO)的线性表，队尾入队，队头出队。顺序队列用数组实现，front指向队头，rear指向队尾。入队：data[rear++]=e；出队：e=data[front++]。考研重点：假溢出问题——当rear到达数组末尾但front前面有空位时，队列"满了"但实际没满，需要使用循环队列解决。',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['先进先出(FIFO)原则', '考研重点：队列在BFS中的应用', '假溢出问题引出循环队列', '队满队空判断条件'],
  rendererType: 'queue',
  defaultData: [10, 20, 30, 40],
  sourceCode: `typedef struct {
    ElemType data[MaxSize];
    int front, rear;                   // 队头、队尾指针
} SqQueue;

// 入队操作
bool EnQueue(SqQueue &Q, ElemType e) {
    if (Q.rear == MaxSize) return false; // 队满检查
    Q.data[Q.rear++] = e;               // 入队：放到队尾
    return true;
}

// 出队操作
bool DeQueue(SqQueue &Q, ElemType &e) {
    if (Q.front == Q.rear) return false; // 队空检查
    e = Q.data[Q.front++];              // 出队：取出队头
    return true;
}`,
  generateSteps(arr) {
    const queue = []; const steps = [];
    let front = 0, rear = 0;
    steps.push({ line: 1, phase: '初始化', description: '创建空队列，front=rear=0', data: { queue: [], meta: { front, rear } }, highlights: {}, pointers: {} });
    for (let i = 0; i < arr.length; i++) {
      queue.push(arr[i]); rear++;
      steps.push({ line: 8, phase: '入队', description: `EnQueue(${arr[i]})：rear++=${rear}`, data: { queue: [...queue], meta: { front, rear: rear - 1 } }, highlights: { active: [queue.length - 1] }, pointers: {} });
    }
    for (let i = 0; i < 2; i++) {
      const val = queue[0]; queue.shift(); front++;
      steps.push({ line: 14, phase: '出队', description: `DeQueue()：取出 ${val}，front++=${front}`, data: { queue: [...queue], meta: { front, rear: rear - 1 } }, highlights: { active: [0] }, pointers: {} });
    }
    steps.push({ line: 15, phase: '完成', description: `队列: [${queue.join(', ')}]`, data: { queue: [...queue], meta: { front, rear: rear - 1 } }, highlights: {}, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
