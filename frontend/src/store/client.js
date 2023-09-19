const protocol = "http://";
const server = window.location.host;
const v1 = protocol + server+"/api/v1";

export async function client(method, {query, body} = {}) {
    let URL = v1+"/records";
  
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
    }
  
    if (body) {
      config.body = JSON.stringify(body)
    }
    if (query) {
        URL = URL + '?'+ query
    }
  
    let data
    try {
      const response = await window.fetch(URL, config)
      data = await response.json()
      if (response.ok) {
        return {
          status: response.status,
          data,
          headers: response.headers,
          url: response.url,
        }
      }
      throw new Error(response.statusText)
    } catch (err) {
      return Promise.reject(err.message ? err.message : data)
    }
  }
  
  client.get = function () {
    return client('GET')
  }
  
  client.post = function (body) {
    return client('POST', {body})
  }

  client.put = function (body) {
    return client('PUT', {body})
  }

  client.delete = function (query) {
    return client('DELETE', {query})
  }
  