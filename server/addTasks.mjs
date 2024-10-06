import Task from "./tasks.mjs";

const tasks = [{ content: "my first task" }, { content: "my second task" }, { content: "my third task" }];

export default () => {
  return Promise.all(tasks.map(t => {
    return Task.findOne({ content: t.content })
      .then(task => {
        if (task) {
          console.log("Task is added before", task);
          return;
        }

        console.log('Adding new task');
        const taskEntry = new Task({
          content: t.content,
        });

        return taskEntry.save()
          .then(task => console.log("New task saved", task))
          .catch(err => {
              console.error("Cannot save task", err);
              throw err;
            });
      })
      .catch(err => {
        console.error("Error searching task", err);
        throw err;
      })
  }));
}
