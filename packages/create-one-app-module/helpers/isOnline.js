/*
 * Copyright 2021 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const { execSync } = require('child_process');
const dns = require('dns');
const url = require('url');

function getProxy() {
  if (process.env.HTTPS_PROXY) {
    return process.env.HTTPS_PROXY;
  }
  try {
    const httpsProxy = execSync('npm config get https-proxy').toString().trim();
    return httpsProxy !== 'null' ? httpsProxy : undefined;
  } catch (e) {

  }
}

function isUrlAvailableAsync(host) {
  return new Promise((resolve) => {
    dns.lookup(host, (err) => {
      resolve(!err);
    });
  });
}

async function getOnline() {
  if (await isUrlAvailableAsync('registry.yarnpkg.com')) {
    return true;
  }
  const proxy = getProxy();
  if (!proxy) {
    return false;
  }
  const { hostname } = url.parse(proxy);
  if (!hostname) {
    return false;
  }
  return !await isUrlAvailableAsync(hostname);
}

module.exports = {
  getProxy,
  getOnline,
};
