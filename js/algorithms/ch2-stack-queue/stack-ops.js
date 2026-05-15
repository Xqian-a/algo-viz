import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch2-stack-ops',
  name: '栈操作',
  nameEn: 'Stack Operations',
  chapter: 'ch2-stack-queue',
  chapterName: '栈和队列',
  description: '栈是后进先出(LIFO)的线性表，只允许在栈顶进行插入和删除。顺序栈用数组实现，top指向栈顶元素。入栈：先top++再赋值；出栈：先取值再top--。考研重点：栈的应用——括号匹配、表达式求值(后缀表达式)、递归转非递归、进制转换。注意栈满(top==MaxSize-1)和栈空(top==-1)的判断条件。',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['后进先出(LIFO)原则', '考研重点：栈的应用——括号匹配、表达式求值', '顺序栈和链栈的区别', '栈满/栈空的判断条件'],
  rendererType: 'stack',
  defaultData: [10, 20, 30, 40, 50],
  sourceCode: `// 顺序栈
typedef struct {
    ElemType data[MaxSize];
    int top;                       // 栈顶指针
} SqStack;

// 入栈操作
bool Push(SqStack &S, ElemType e) {
    if (S.top == MaxSize - 1)      // 栈满检查
        return false;
    S.data[++S.top] = e;           // 先移动指针再赋值
    return true;
}

// 出栈操作
bool Pop(SqStack &S, ElemType &e) {
    if (S.top == -1)               // 栈空检查
        return false;
    e = S.data[S.top--];           // 先取值再移动指针
    return true;
}`,
  generateSteps(arr) {
    const stack = []; const steps = [];
    steps.push({ line: 1, phase: '初始化', description: '创建空栈，top = -1', data: { stack: [] }, highlights: {}, pointers: {} });
    for (let i = 0; i < arr.length; i++) {
      stack.push(arr[i]);
      steps.push({ line: 10, phase: '入栈', description: `Push(${arr[i]})：top++，将 ${arr[i]} 压入栈顶`, data: { stack: [...stack] }, highlights: { active: [stack.length - 1] }, pointers: {} });
    }
    steps.push({ line: 10, phase: '栈满', description: `栈已满（top=${stack.length - 1}），继续入栈会溢出`, data: { stack: [...stack] }, highlights: {}, pointers: {} });
    for (let i = 0; i < 3; i++) {
      const val = stack[stack.length - 1];
      stack.pop();
      steps.push({ line: 18, phase: '出栈', description: `Pop()：取出栈顶 ${val}，top--`, data: { stack: [...stack] }, highlights: { active: [stack.length] }, pointers: {} });
    }
    steps.push({ line: 19, phase: '完成', description: `当前栈: [${stack.join(', ')}]，top=${stack.length - 1}`, data: { stack: [...stack] }, highlights: {}, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
