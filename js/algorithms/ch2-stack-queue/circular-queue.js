import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch2-circular-queue',
  name: '循环队列',
  nameEn: 'Circular Queue',
  chapter: 'ch2-stack-queue',
  chapterName: '栈和队列',
  description: '循环队列通过取模运算将数组首尾相连，解决了顺序队列的假溢出问题。队空条件：front==rear；队满条件：(rear+1)%MaxSize==front（牺牲一个存储空间来区分队空和队满）。元素个数：(rear-front+MaxSize)%MaxSize。入队：data[rear]=e; rear=(rear+1)%MaxSize。考研重点：理解取模运算实现循环的过程。',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['解决假溢出问题', '队空：front==rear，队满：(rear+1)%MaxSize==front', '牺牲一个空间区分队空和队满', '元素个数：(rear-front+MaxSize)%MaxSize'],
  rendererType: 'queue',
  defaultData: [10, 20, 30],
  sourceCode: `#define MaxSize 5
typedef struct {
    ElemType data[MaxSize];
    int front, rear;                          // 队头、队尾指针
} SqQueue;                                    // 牺牲一个空间区分队空队满

bool EnQueue(SqQueue &Q, ElemType e) {
    if ((Q.rear + 1) % MaxSize == Q.front)    // 队满条件
        return false;
    Q.data[Q.rear] = e;
    Q.rear = (Q.rear + 1) % MaxSize;          // 取模实现循环
    return true;
}

ElemType DeQueue(SqQueue &Q) {
    if (Q.front == Q.rear) return -1;         // 队空条件
    ElemType e = Q.data[Q.front];
    Q.front = (Q.front + 1) % MaxSize;        // 取模实现循环
    return e;
}`,
  generateSteps(arr) {
    const maxSize = 5;
    const queue = new Array(maxSize).fill(null);
    let front = 0, rear = 0;
    const steps = [];
    steps.push({ line: 1, phase: '初始化', description: `循环队列，MaxSize=${maxSize}，front=rear=0`, data: { queue: [...queue.filter(x => x !== null)], meta: { front, rear } }, highlights: {}, pointers: {} });
    for (let i = 0; i < arr.length; i++) {
      queue[rear] = arr[i];
      rear = (rear + 1) % maxSize;
      steps.push({ line: 10, phase: '入队', description: `EnQueue(${arr[i]})：rear=(${rear - 1 + maxSize}%${maxSize}+1)%${maxSize}=${rear}`, data: { queue: queue.filter(x => x !== null), meta: { front, rear: (rear - 1 + maxSize) % maxSize } }, highlights: { active: [(rear - 1 + maxSize) % maxSize] }, pointers: {} });
    }
    const e1 = queue[front]; queue[front] = null; front = (front + 1) % maxSize;
    steps.push({ line: 17, phase: '出队', description: `DeQueue()：取出 ${e1}，front=${front}`, data: { queue: queue.filter(x => x !== null), meta: { front, rear: (rear - 1 + maxSize) % maxSize } }, highlights: {}, pointers: {} });
    const e2 = queue[front]; queue[front] = null; front = (front + 1) % maxSize;
    steps.push({ line: 17, phase: '出队', description: `DeQueue()：取出 ${e2}，front=${front}`, data: { queue: queue.filter(x => x !== null), meta: { front, rear: (rear - 1 + maxSize) % maxSize } }, highlights: {}, pointers: {} });
    queue[rear] = 60; rear = (rear + 1) % maxSize;
    steps.push({ line: 10, phase: '继续入队', description: `EnQueue(60)：rear=${rear}（循环回来了）`, data: { queue: queue.filter(x => x !== null), meta: { front, rear: (rear - 1 + maxSize) % maxSize } }, highlights: { active: [(rear - 1 + maxSize) % maxSize] }, pointers: {} });
    steps.push({ line: 19, phase: '完成', description: `元素个数：(rear-front+MaxSize)%MaxSize = ${(rear - front + maxSize) % maxSize}`, data: { queue: queue.filter(x => x !== null), meta: { front, rear: (rear - 1 + maxSize) % maxSize } }, highlights: {}, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
