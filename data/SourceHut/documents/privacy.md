<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    

<title>Privacy policy - man.sr.ht</title>


    
    <link rel="icon" type="image/svg+xml" href="/static/logo.svg" />
    <link rel="icon" type="image/png" href="/static/logo.png" sizes="any" />
    
    <link rel="stylesheet" href="/static/man.sr.ht/main.min.617f293d.css">
    
    
    
    
  </head>
  <body>
    
    
    
    
    <nav class="container navbar navbar-light navbar-expand-sm">
      
<span class="navbar-brand">
  <span class="icon icon-circle " aria-hidden="true"><svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"/></svg>
</span>
  <a href="https://sr.ht">
    sourcehut
  </a>
</span>

<ul class="navbar-nav">
  
</ul>
<div class="login">
  
  <span class="navbar-text">
    
    <a href="https://meta.sr.ht/oauth/authorize?client_id=ff4e41c77d9a2ec2&amp;scopes=profile,25ff6e5ce60d7345/data,25ff6e5ce60d7345/info:write&amp;state=%2Fprivacy.md%3F" rel="nofollow">Log in</a>
    &mdash;
    <a href="https://meta.sr.ht">Register</a>
    
  </span>
  
</div>
    </nav>
    
     


<div class="header-tabbed">
  <div class="container">
    <ul class="nav nav-tabs">
      <h2>
          Privacy policy
      </h2>
      <li class="nav-item">
        <a
          class="nav-link active"
          href="/~sircmpwn/sr.ht-docs/"
        >article</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="https://git.sr.ht/~sircmpwn/sr.ht-docs/tree/master/privacy.md?view-source"
        >source</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="https://git.sr.ht/~sircmpwn/sr.ht-docs/log/master"
        >history</a>
      </li>
    </ul>
  </div>
</div>


<div class="container">
  <div class="content">
    
  </div>
</div>

<div class="container">
  <div class="event-list row">
    <div class="event toc col-md-12">
      <h3>Table of Contents</h3>
      <ol>
        
        
          
        <li>
          <a href="#what-we-collect-and-why">What we collect and why</a>
          
          <ul style="list-style: none; padding-left: 1rem">
            
              
        <li>
          <a href="#how-we-share-your-information-with-third-parties">How we share your information with third-parties</a>
          
        </li>
        
            
              
        <li>
          <a href="#how-to-access-and-control-the-information-weve-collected">How to access and control the information we&#39;ve collected</a>
          
        </li>
        
            
              
        <li>
          <a href="#changes-to-this-document">Changes to this document</a>
          
        </li>
        
            
          </ul>
          
        </li>
        
        
      </ol>
      
    </div>
  </div>
</div>

<div class="container" style="flex-grow: 1">
  <div class="content">
    <style>.highlight { background: inherit; }</style><div class="markdown"><p>If you have any questions, please reach out to <a href="mailto:~sircmpwn/sr.ht-support@lists.sr.ht">sr.ht-support</a> via email.</p>
<h4 id="what-we-collect-and-why"><a aria-hidden="true" href="#what-we-collect-and-why">#</a>What we collect and why</h4>
<p>The only data we require of your account is your email address; a username of
your choosing, which must be unique among all users; and a password. Your email
and username are stored in "plain text". Your password is stored after
processing with bcrypt, from which the original password cannot be devised
without a computationally expensive process. However, given your password, we
can determine that it matches our stored key without expensive processing.  The
purpose of this step is to ensure that should our database become compromised,
your original password will be difficult to recover. Regardless, you are
strongly encouraged to use a unique password for your sr.ht account.</p>
<p>You may choose to give us additional information, which is shown publicly on
the site. This includes:</p>
<ul>
<li>Your location</li>
<li>A URL to any website</li>
<li>A short biography</li>
</ul>
<p>You may omit or provide fictitious data for this information.</p>
<p>You may be required to provide the following information in order to
successfully operate some parts of the service, some of which may be used to
uniquely identify you:</p>
<ul>
<li>SSH keys</li>
<li>PGP keys</li>
<li>Two-factor authorization keys</li>
</ul>
<p>You may delete this information at any time by visiting your <a href="https://meta.sr.ht">account
details</a>. If you provide a PGP key, you may choose to have
email communications from sr.ht encrypted before being sent to you.</p>
<p>We also obtain some information from your web browser as you use our services
and store it for up to 30 days:</p>
<ul>
<li>Your IP address</li>
<li>When you accessed the site</li>
<li>What you did on the site</li>
</ul>
<p>This information is available to you as an <a href="https://meta.sr.ht/security">audit
log</a>. You are not able to delete this information.
The purpose of this data collection is to inform both you and sr.ht of any
unknown activity on your account. If we permitted deletion of this information,
someone who obtains unauthorized access to your account would be able to delete
it, too.</p>
<p>We also store various other kinds of information that you explicitly choose to
give us, including (but not limited to):</p>
<ul>
<li>repositories on git.sr.ht</li>
<li>tickets on todo.sr.ht</li>
<li>build logs and secrets on builds.sr.ht</li>
</ul>
<p>To faciliate automated access to your account for third-party service or your
personal use, we also generate and store API keys which can be used to authorize
use of your account. A portion of these keys are stored in plaintext — not
enough to gain access to your account, but enough for us to quickly look up your
account details given the key. The full key is stored only after processing with
bcrypt, similar to the process used for your password.</p>
<p>If you choose to use our paid services, we will store a token which is used to
bill your payment method. Information like your credit card number cannot be
recovered from this token.</p>
<p>We also use cookies to store long-lived authorization data, to remember that
you're logged into your account between visits without prompting you for your
password again. We also use cookies to store short-lived information, like the
fact that we have to tell you on the next page you load that we completed some
operation successfully for you.</p>
<h5 id="how-we-share-your-information-with-third-parties"><a aria-hidden="true" href="#how-we-share-your-information-with-third-parties">#</a>How we share your information with third-parties</h5>
<p>Aside from information you choose to make public in the course of your use of
sr.ht and information you explicitly choose to share with specific
third parties, none of your information is shared with third parties. We do not
embed third-party content in our website, with one exception: on the billing
page, we embed a script from <a href="https://stripe.com">Stripe</a>. This measure is taken
to improve your privacy and allows us to avoid directly handling your credit
card information.</p>
<p>We permit user-generated content to include images from and links to third-party
sites. On pages displaying this content, information may be sent to these
third-parties. This information includes:</p>
<ul>
<li>Your IP address</li>
<li>Information about your web browser, such as whether you use Firefox or Chrome</li>
<li>The URL on sr.ht you visited when you saw this content</li>
</ul>
<p>We are not responsible for any additional information your web browser may send
to these third parties.</p>
<p>If you use any of our paid services, we will transmit your payment information
to a third-party payment processor. You will be notified of this before the
information is transmitted, and given an opportunity to prevent its
transmission. We will be unable to provide you with paid services if you decline
to transmit this information.</p>
<p>We may also be required to remit your data upon receiving an order from a court
of the United States. If permitted by the order, you will be notified if this
happens.</p>
<h5 id="how-to-access-and-control-the-information-weve-collected"><a aria-hidden="true" href="#how-to-access-and-control-the-information-weve-collected">#</a>How to access and control the information we've collected</h5>
<p>You may submit a request via email to <a href="mailto:~sircmpwn/sr.ht-support@lists.sr.ht">support</a> to request an
archive of the information we've collected about you, or to request that we
remove any information we've collected about you.</p>
<p>You may also reach out to our data protection officer directly: Drew DeVault
<a href="mailto:sir@cmpwn.com">sir@cmpwn.com</a>.</p>
<h5 id="changes-to-this-document"><a aria-hidden="true" href="#changes-to-this-document">#</a>Changes to this document</h5>
<p>We may make changes to this document with no less than 2 weeks notice. Notice of
these changes will be sent to the email on file for your account.</p>
</div>
  </div>
</div>
<div class="container">
  <h3>About this wiki</h3>
  <div class="row">
    <div class="col-md-8">
      <pre>commit <a
href="https://git.sr.ht/~sircmpwn/sr.ht-docs/commit/d161f15e26e128af5b1c21748f2bf60bf030950d"
>d161f15e26e128af5b1c21748f2bf60bf030950d</a>
Author: CismonX &lt;admin@cismon.net&gt;
Date:   2025-02-21T05:30:33+08:00

builds.sr.ht/compat: drop FreeBSD unsupported arch

Platforms unsupported upstream should not appear in the
FreeBSD compatibility matrix.

See &lt;https://www.freebsd.org/platforms/&gt;.</pre>
      <dl>
        <dt><strong>Clone this wiki</strong></dt>
        <dd>
        
          
          <a href=https://git.sr.ht/~sircmpwn/sr.ht-docs>https://git.sr.ht/~sircmpwn/sr.ht-docs</a>
          <span class="text-muted pull-right">(read-only)</span><br />
          
        
          
          git@git.sr.ht:~sircmpwn/sr.ht-docs
          <span class="text-muted pull-right">(read/write)</span><br />
          
        
        </dd>
      </dl>
    </div>
    <div class="col-md-4">
      
    </div>
  </div>
</div>


    
    
  </body>
</html>