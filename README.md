issueblog
=========

generate a blog powered on your github page's issues.

This tool enable you to write blogs as issues of your personal github page's repository. Instead of tunning css and theme of your github pages, or spend days and nights to cofigure jekyll or octopress to create your blog pages, you can build your blog in a minute and then start to write your blog immediately. You can also bind your own domain name to your pages, by placing a CNAME file in your repository where the content of file is your domain name, such as "mrraindrop.com".

demo: [DEFINITELY H&P](http://mrraindrop.com/)

## USAGE

First you must installed nodejs, then you can install this tool through npm.

```
npm install -g issueblog
```

Then just enter command:

```
issueblog
```

Enter your login name and password and a domain name if your want to use your own domain name. Issue blog will auto-generate a CNAME file for you (or you can just leave it to blank and press enter.) Wait a few seconds and a fresh new issueblog will be generated!


