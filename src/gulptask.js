import {SingletonFactory} from 'singletons';
import gulp from 'gulp';
import DependencyMap from './dependency-map';
import {getName, setMainProperties, mixInStreamerProperties,
  setFunctionProperties} from './properties';

const dependencies = new DependencyMap();

export class SimpleGulpTask {
  constructor (...args) {
    setMainProperties(this, args);

    mixInStreamerProperties(this);

    setFunctionProperties(this, args);

    dependencies.register(this);

    gulp.task(this.execFn);
    gulp.task(this.watchFn);
    gulp.task(`tdd:${this.name}`, gulp.series(this.execFn, this.watchFn));
  }

  getDependencies () {
    return dependencies.getDependencies(this);
  }

  getDependents () {
    return dependencies.getDependents(this);
  }

  getTask (name) {
    return GulpTask.get(name);
  }
}

const GulpTask = SingletonFactory(SimpleGulpTask, // eslint-disable-line new-cap
  ['literal', {type: 'ignore', rest: true}], {
    preprocess (args) {
      return [getName(args), ...args];
    },
  });

export default GulpTask;
