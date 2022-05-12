
import path from "path";
import Sanari from "./sanari.js";
import Database from "./database.js";
import Bundle from "./bundle.js";
import App from "./app.js";
import Init from "./init.js";
import Router from "./router.js";

export default class Sans
{

  static #_ini = undefined;

  #_core = undefined;
  #_sanari = undefined;
  #_sanari_class_name = undefined;

  constructor(core)
  {
    this.#_core = core;
    this.#_sanari = Sanari.setup();
    this.#_sanari_class_name = this.#_sanari.constructor.name.toLowerCase();

    this.#base();
  }

  #router()
  {
    const router = Router.setup();
    router.apps = App.apps();
    router.router = this.#_core.router;
    router.core = this.#_core;
    router.handler = () => {
      console.log(this);
    }
    router.run();
  }

  #apps()
  {
    return () => {
      this["app"] = () => {
        const init = Init.setup();
        const caller = init.caller;
        const apps = App.apps();

        // console.log(caller);
        // console.log(apps);
        return this;
      };
      this.#router();
    };
  }

  #app()
  {
    return () => {
      const app = App.setup(
        {
          app: this.#_sanari_class_name
        }
      );
      app.core = this.#_core;
      app.root = this;
      app.handler = this.#apps();
      app.run();
    }
  }

  #sanari()
  {
    return () => {
      const dir = path.join(___basedir, this.#_sanari_class_name);
      const bundle = Bundle.setup(this.#_sanari_class_name);
      bundle.root = this;
      bundle.handler = this.#app();
      bundle.directory = dir;
      bundle.run();
    }
  }

  #database()
  {
    return () => {
      const database = Database.setup();
      database.handler = this.#sanari();
      database.core = this.#_core;
      database.run();
    }
  }

  #base()
  {
    this.#database()();
  }

  static setup(args)
  {
    if (!this.#_ini) {
      this.#_ini = new Sans(args);
    }
    return this.#_ini;
  }

  get sanari()
  {
    return this.#_sanari;
  }
}