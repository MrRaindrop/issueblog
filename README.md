issueblog
=========

generate a blog powered on your github page's issues.

This tool enable you to write blogs as issues of your personal github page's repository. Instead of tunning css and theme of your github pages, or spend days and nights to cofigure jekyll or octopress to create your blog pages, you can build your blog in a minute and then start to write your blog immediately. You can also bind your own domain name to your pages, by placing a CNAME file in your repository where the content of file is your domain name, such as "mrraindrop.com".

demo: [DEFINITELY H&P](http://mrraindrop.com/)

## USAGE

First you must have a nodejs installed, then you can install this tool through npm.

```
npm install -g issueblog
```

Then just enter command:

```
issueblog
```

Enter your login name and password and a domain name (if your want to use your own domain name) according to the tips on your screen.If the domain name is entered, issueblog will auto-generate a CNAME file for you to enable github to generate a c record for your domain name. (Or you can just leave the domain name to blank and press enter to ignore it.) Wait a few seconds your fresh new issueblog will be generated!


