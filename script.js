// ننتظر حتى يتم تحميل محتوى الصفحة بالكامل قبل تنفيذ الشيفرة
document.addEventListener('DOMContentLoaded', () => {

    // الحصول على عناصر الواجهة الرسومية
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // ======================================================
    // الدوال الخاصة بالتعامل مع LocalStorage
    // ======================================================

    /**
     * استرجاع المهام من localStorage.
     * @returns {Array} مصفوفة من المهام أو مصفوفة فارغة.
     */
    const getTasksFromStorage = () => {
        // إذا كانت هناك مهام مخزنة، قم بتحويلها من نص JSON إلى كائن JavaScript
        // وإلا، قم بإرجاع مصفوفة فارغة
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    /**
     * حفظ المهام في localStorage.
     * @param {Array} tasks - مصفوفة المهام المراد حفظها.
     */
    const saveTasksToStorage = (tasks) => {
        // قم بتحويل كائن المهام إلى نص JSON واحفظه في localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // تحميل المهام عند بدء تشغيل التطبيق
    let tasks = getTasksFromStorage();

    // ======================================================
    // الدوال الخاصة بتحديث واجهة المستخدم (UI)
    // ======================================================

    /**
     * عرض المهام على الشاشة.
     */
    const renderTasks = () => {
        // تفريغ القائمة الحالية لمنع تكرار المهام
        taskList.innerHTML = '';

        // المرور على كل مهمة في مصفوفة المهام
        tasks.forEach((task, index) => {
            // إنشاء عنصر قائمة جديد (li)
            const li = document.createElement('li');

            // إضافة فئة "completed" إذا كانت المهمة مكتملة
            if (task.completed) {
                li.classList.add('completed');
            }

            // إنشاء عنصر span لعرض نص المهمة
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            // إضافة خاصية data-index لتحديد فهرس المهمة
            taskText.dataset.index = index;

            // إنشاء زر الحذف
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            // إضافة خاصية data-index لتحديد فهرس المهمة
            deleteButton.dataset.index = index;

            // إضافة نص المهمة وزر الحذف إلى عنصر القائمة
            li.appendChild(taskText);
            li.appendChild(deleteButton);

            // إضافة عنصر القائمة إلى قائمة المهام في الصفحة
            taskList.appendChild(li);
        });
    };

    // ======================================================
    // الدوال الخاصة بإدارة المهام (إضافة, حذف, إكمال)
    // ======================================================

    /**
     * إضافة مهمة جديدة.
     * @param {string} text - نص المهمة.
     */
    const addTask = (text) => {
        // إضافة المهمة الجديدة إلى مصفوفة المهام
        tasks.push({ text: text, completed: false });
        // حفظ المصفوفة المحدثة في localStorage
        saveTasksToStorage(tasks);
        // إعادة عرض المهام على الشاشة
        renderTasks();
    };

    /**
     * تبديل حالة المهمة (مكتملة / غير مكتملة).
     * @param {number} index - فهرس المهمة.
     */
    const toggleTaskCompletion = (index) => {
        // تبديل قيمة "completed"
        tasks[index].completed = !tasks[index].completed;
        // حفظ التغييرات
        saveTasksToStorage(tasks);
        // إعادة عرض المهام
        renderTasks();
    };

    /**
     * حذف مهمة.
     * @param {number} index - فهرس المهمة.
     */
    const deleteTask = (index) => {
        // حذف المهمة من المصفوفة باستخدام فهرسها
        tasks.splice(index, 1);
        // حفظ التغييرات
        saveTasksToStorage(tasks);
        // إعادة عرض المهام
        renderTasks();
    };

    // ======================================================
    // مستمعو الأحداث (Event Listeners)
    // ======================================================

    // مستمع لحدث إرسال النموذج (إضافة مهمة)
    taskForm.addEventListener('submit', (e) => {
        // منع السلوك الافتراضي للنموذج (إعادة تحميل الصفحة)
        e.preventDefault();

        // الحصول على نص المهمة من حقل الإدخال وإزالة المسافات الزائدة
        const taskText = taskInput.value.trim();

        // التأكد من أن حقل الإدخال ليس فارغًا
        if (taskText !== '') {
            // إضافة المهمة الجديدة
            addTask(taskText);
            // تفريغ حقل الإدخال
            taskInput.value = '';
        }
    });

    // مستمع لحدث النقر على قائمة المهام (للتعامل مع الحذف والإكمال)
    taskList.addEventListener('click', (e) => {
        // التحقق مما إذا كان العنصر الذي تم النقر عليه هو نص المهمة (span)
        if (e.target.tagName === 'SPAN') {
            // الحصول على فهرس المهمة من خاصية data-index
            const index = e.target.dataset.index;
            // تبديل حالة اكتمال المهمة
            toggleTaskCompletion(index);
        }

        // التحقق مما إذا كان العنصر الذي تم النقر عليه هو زر الحذف (button)
        if (e.target.tagName === 'BUTTON') {
            // الحصول على فهرس المهمة
            const index = e.target.dataset.index;
            // حذف المهمة
            deleteTask(index);
        }
    });

    // عرض المهام المخزنة عند تحميل الصفحة لأول مرة
    renderTasks();
});
