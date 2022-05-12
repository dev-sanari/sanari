import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from "express";
const router = express.Router();

/**
 * endpoint GET "/"
 */
router.get("/", async (req, res, next) => {
  
  req.permission_name = "baseurl";

  // set middleware
  let middleware = [
    (req, res, next) => {
      
      const {
        name, 
        version, 
        dependencies, 
        devDependencies = {}
      } = require(`${___basedir}/package.json`);

      const data = {
        name, 
        version,
        dependencies,
        devDependencies,
        sanari: sans.sanari.bundle(),
        sans
      };

      // const data = {};
      return sans.helpers.response
        .success(
          data, 
          sans.helpers.sanari.sayHello("Sanari")
        );
    }
  ];

  // call middleware function custom
  sans.helpers.middleware.run(middleware);
});

export default router;