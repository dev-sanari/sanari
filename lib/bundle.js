
import path from "path";

import Sanari from "./sanari.js";
import Init from "./init.js";

export default class Bundle
{
  static #_ini_sanari = undefined;

  #_sanari = undefined;
  #_sanari_class_name = undefined;
  #_root = undefined;
  #_init = undefined;
  #_basedir = undefined;
  #_counter = 1;

  #_handler = () => {};

  constructor()
  {
    this.#_sanari = Sanari.setup();
    this.#_sanari_class_name = this.#_sanari.constructor.name.toLowerCase();
  }

  #counter()
  {
    try {
      return this.#_counter;
    } finally {
      this.#_counter++;
    }
  }

  #item()
  {
    return async (bundle, _, arr) => {
      const basedir = path.join(this.#_basedir, bundle);
      this.#_root[bundle] = await this.#_init.sub_sanari(basedir);
      if (this.#counter() === arr.length) {
        this.#_handler();
      }
    }
  }

  #bundle_root()
  {
    this.#_init = Init.setup();
    this.#_init.filter = (value) => 
      (
        value.indexOf(".") === -1 ||
        value.slice(-3) === ".js"
      );
    this.#_sanari.bundle().forEach(this.#item());
  }

  run()
  {
    this.#bundle_root();
  }

  static setup(instance)
  {
    const sanari = Sanari.setup();
    const sanari_class_name = sanari.constructor.name.toLowerCase();
    if (instance === sanari_class_name) {
      if (!this.#_ini_sanari) {
        this.#_ini_sanari = new Bundle();
      }
      return this.#_ini_sanari;
    }
    return new Bundle();
  }
  
  /**
   * @param {() => void} args
   */
  set handler(args)
  {
    this.#_handler = args;
  }

  /**
   * @param {any} args
   */
  set root(args)
  {
    this.#_root = args;
  }

  /**
   * @param {any} args
   */
  set directory(args)
  {
    this.#_basedir = args;
  }

}