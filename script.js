const { openBrowser, goto, click, inputField, write, textBox, below, toLeftOf, checkBox, closeBrowser } = require('taiko');
(async () => {
    try {
        await openBrowser();
        await goto("http://localhost:3000");
        await click("Add Task");
        await write("eat something", textBox());
        await click("Add Task");
        await write("go for a walk", textBox(below(textBox())));
        await click("Add Task");
        await write("foo", textBox(below(textBox(below(textBox())))));

        await click(button(toRightOf("foo")));
        await click(checkBox(toLeftOf("go for a walk")));
        await click(checkBox(toLeftOf("eat something")));
        await click(checkBox(toLeftOf("eat something")));

        await screenshot($("#root"), { path: 'script.result.png' });
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
