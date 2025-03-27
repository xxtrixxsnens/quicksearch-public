## Own Version of Unduck with plain js

- Easy to use locally => Not blocked by firewall

### Just serve the html and make it your default search engine!

Example:

```python
python3 -m http.server 8080
```

```
http://localhost:8080?q=%s
```
---
# Unduck

DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables all of DuckDuckGo's bangs to work, but much faster.

```
https://unduck.link?q=%s
```

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

I solved this by doing all of the work client side. Once you've went to https://unduck.link once, the JS is all cache'd and will never need to be downloaded again. Your device does the redirects, not me.
