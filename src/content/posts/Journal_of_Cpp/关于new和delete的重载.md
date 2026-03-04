---
title: 关于new和delete的重载
published: 2026-03-04T15:53:30.623Z
description: ''
updated: ''
tags:
  - Journal of C Plus Plus
draft: false
pin: 0
toc: true
lang: 'zh'
abbrlink: ''
---

学习一下 new 和 delete 关键字如何重载：

我们在使用 `new` 关键字时，实际上调用的是 `operator new` 来分配空间，更加具体的：实际上是这两个函数：

```c
void *operator new(size_t);      // allocate an object
void *operator new[](size_t);    // allocate an array
```

`new` 的功能主要为：分配空间、初始化对象、返回指针。

我们可以通过重载 `operator new`，实现不同版本的空间分配方式，下面依次给出几个例子：

1. 最简单版本：

   ```cpp
   class Foo {
   public:
    void* operator new(std::size_t size)
    {
     std::cout << "operator new" << std::endl;
     return std::malloc(size);
    }
   }
   
   int main()
   {
    Foo* m = new Foo;
    std::cout << sizeof(m) << std::endl;
    delete m;
    return 0; 
   }
   ```

   注意事项如下：

   - `operator new` 返回值必须是  `void*`，返回的是一块未初始化的内存块的起始地址。
   - 参数列表中的首个参数类型必须是 `std::size_t`，具体原因暂不清楚，似乎是一个占位符号。
   - 当编译器发现有 `new` 关键字时，就会在现有的类或其基类中寻找 `operator new`，如果没有则在全局中找，如果还是未找到，则使用默认方法。
   - 类中的 `operator new` 默认是 static，所以在类中可加可不加。

2. 加入其他形参：

   ```cpp
   class Foo {
   public:
    void* operator new(std::size_t size, int num)
    {
     std::cout << "operator new" << std::endl;
     std::cout << "num is " << num << std::endl;
     return std::malloc(size);
    }
   }
   
   int main()
   {
    Foo* m = new(100) Foo;
    std::cout << sizeof(m) << std::endl;
    delete m;
    return 0; 
   }
   ```

    上述 `operator new` 重载接收了额外一个形参，可以发现 `operator new` 的重载自由度是非常大的。

3. `placement new` ：一种 `operator new` 的重载形式，相比较上述的 `operator new` 的主要作用是分配空间和初始化对象，`placement new` 没有分配新的空间，它是利用 `ptr` 的地址初始化对象。由于其不需要频繁地申请和释放旧内存（频繁地申请和释放内存，需要花费时间去查找足够大的剩余空间，同时可能会出现无法分配内存，即内存不足的情况），所以被广泛使用于内存池中。例子如下：

   ```cpp
   class Foo {
   public:
    void* operator new(std::size_t size, void* ptr)
    {
       std::cout << "placement new" << std::endl;
     	return ptr;
    }
   }
   
   int main()
   {
   	Foo* m = new Foo;
    	Foo* m2 = new(m) Foo;
    	std::cout << sizeof(m) << std::endl;
       // delete m2;
    	delete m;
    	return 0; 
   }
   ```

   这里，`m2` 的初始化是利用 `m` 的内存空间，所以如果 `m` 和 `m2` 实际上指向的是同一块内存，不能重复 `delete`。

类似的，我们也可以重载 `operator delete`：

```cpp
void operator delete(void* ptr)
{
 	std::cout << "operator delete" << std::endl;
 	std::free(ptr);
}
```

注意事项如下：

- 返回值必须为 `void`。
- 一般不推荐这种调用方法，除非在处理 Placement New 的异常善后，下面介绍一下是为什么。

当我们写 `delete ptr;` 时，这是一个**表达式**。编译器会把这个表达式展开为两个步骤：
1.  调用析构函数：销毁对象，清理资源。
2.  调用 `operator delete` 函数：释放内存。

我们调用重载的 `operator delete`，实际上是只释放了内存。如果绕过 `delete 表达式`，直接手动调用 `operator delete(ptr)`，我们只是在**释放内存**，而**不会调用析构函数**。看下面的例子：

```cpp
class MyClass {
public:
    int* data;
    MyClass() { data = new int[1000]; } // 构造时分配资源
    ~MyClass() { delete[] data; }        // 析构时释放资源
    
    // 重载 operator delete
    void operator delete(void* ptr) {
        std::cout << "Custom operator delete called\n";
        ::free(ptr); // 假设对应的 new 是用 malloc 分配的
    }
};
int main() {
    MyClass* obj = new MyClass();
    // 错误示范：手动调用 operator delete
    // 这只会释放 obj 指向的内存，但不会调用 ~MyClass()
    // 结果：data 指向的 1000 个 int 发生了内存泄漏！
    MyClass::operator delete(obj); 
    
    // 正确做法：
    // delete obj; // 这会先调用 ~MyClass() 释放 data，再调用 operator delete 释放 obj 本身
}
```
可以发现：手动调用 `operator delete` 导致析构函数被跳过，这是资源泄漏的根源。如果手动调用 `operator delete`，我们实际上只执行了第二步（即，归还对象占有的外壳内存，实现了物理内存的回收），第一步（清理对象内存状态，如内部物理内存等）没有执行。

只有在处理  Placement New 失败的异常时，才需要手动调用 `operator delete`（更准确的说是调用对应的 `placement delete`）：

```cpp
// 假设我们要在 buffer 上构造对象
char buffer[sizeof(MyClass)];
MyClass* p = new (buffer) MyClass(42);
```
如果 `MyClass` 的构造函数抛出了异常，C++ 运行时系统需要负责清理内存。但是，由于这是 Placement New，内存是现成的，不需要释放。此时，编译器会生成代码调用一个**匹配的 `operator delete`**（通常称为 placement delete）。
在这种极少数由编译器内部生成的清理代码中，`operator delete` 是被“手动”调用的，用来处理构造失败后的回滚。
**但对于用户代码，正确的做法是：**如果是 Placement New，我们应该显式调用析构函数，**而不是**调用 `operator delete`：

```cpp
p->~MyClass(); // 正确：显式析构
// 不需要调用 operator delete，因为内存不是它分配的（是栈上的 buffer）
```


此外，我们需要在重载 `operator new` 的同时，需要提供对应版本的 `operator delete`。比方说：

```cpp
// 对应的 operator new 重载
void* operator new(size_t size, int num) {
    std::cout << "operator new with num = " << num << std::endl;
    return std::malloc(size);
}
// 你提供的 operator delete 重载
void operator delete(void* ptr, int num) {
    std::cout << "operator delete" << std::endl;
    std::cout << "num is " << num << std::endl;
    std::free(ptr);
}
```

有趣的是，我们无法直接调用重载后的 `delete`，比方说：

```cpp
delete(10) p;    // 不合法的
```

编译器会提示错误 `expression must be a pointer to a complete object type`。剖析一下原理：

在 C++ 标准中，`delete` 是一个**关键字**，而不是一个函数名，正确的语法形式只有两种：

1. `delete 表达式;` （销毁单个对象）
2. `delete[] 表达式;` （销毁数组）

因此在实际调用时，编译器会提示报错。

实际上，当我们写 `delete ptr;` 时，编译器只会调用标准的 `void operator delete(void*)`，**不会**传递 `num` 参数。我们实际上只能通过手动调用相关的函数，比方说 `operator delete(ptr, 100);`。



由此我们可能会疑惑， `operator delete` 重载到底是干什么用的。实际上这个重载是为了配合**带参数的 Placement New** 使用的。

C++ 标准规定：

- 如果你重载了 `operator new` 带有额外参数，那么你也应该重载对应的 `operator delete`，且参数列表必须严格对应（除了第一个 `void*`）。
- 只有当使用对应的 Placement New 创建对象，且对象的构造函数抛出异常时，编译器才会调用这个带参数的 `operator delete`。（为了处理“内存已分配，但对象构造失败”的情况，需要把分配的内存收回，防止内存泄漏）

一个简单的例子如下：

```cpp
#include <iostream>
#include <cstdlib>
class MyClass {
public:
    // 配套的静态成员 new
    static void* operator new(size_t size, int num) {
        std::cout << "Custom operator new called with num = " << num << std::endl;
        return std::malloc(size);
    }
    // 配套的静态成员 delete
    static void operator delete(void* ptr, int num) {
        std::cout << "Custom operator delete called" << std::endl;
        std::cout << "num is " << num << std::endl;
        if (ptr) std::free(ptr);
    }
    // 普通的 delete（正常销毁时用）
    static void operator delete(void* ptr) {
        std::cout << "Standard operator delete called" << std::endl;
        if (ptr) std::free(ptr);
    }
    MyClass(bool shouldFail) {
        if (shouldFail) {
            std::cout << "Constructor throwing exception..." << std::endl;
            throw std::runtime_error("Construction failed!");
        }
        std::cout << "Constructor succeeded." << std::endl;
    }
};
int main() {
    try {
        // 调用带参数的 new (num = 42)
        // 因为构造函数抛出异常，编译器会自动查找并调用带参数的 delete
        MyClass* obj = new (42) MyClass(true); 
    } 
    catch (const std::exception& e) {
        std::cout << "Caught exception: " << e.what() << std::endl;
    }
    return 0;
}
```
**运行结果：**
```text
Custom operator new called with num = 42
Constructor throwing exception...
Custom operator delete called    <-- 这里自动调用了你的函数！
num is 42
Caught exception: Construction failed!
```
如果我们写 `MyClass* obj = new (42) MyClass(false);`（构造成功），那么当你在未来写 `delete obj;` 时，调用的将是**标准的** `void operator delete(void*)`，而不是带 `int num` 的版本。因为正常的 `delete` 表达式不知道当初传给 `new` 的 `num` 是多少，它只负责释放内存。

简而言之：

1.  重载的 `operator delete`是**被动调用**的，无法主动通过 `delete` 表达式调用。
2.  只有当 `new (parameter) Type` 分配成功，但 `Type` 的构造函数抛出异常时，编译器才会调用它来“善后”。

上述设计确保了在内存分配抛出异常时，我们能够安全地释放内存：因为内存分配时传了额外参数（比如是分配在哪块内存池、哪种日志级别），如果构造失败，释放内存时也需要知道这些额外参数才能正确释放。这就给了我们机会去记录日志或归还特定的内存池。