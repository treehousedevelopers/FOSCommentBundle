/**
 * This file is part of the FOSCommentBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

/**
 * To use this reference javascript for embedding comments.
 *
 * @todo: expand this explanation (also in the docs)
 *
 * Then a comment thread can be embedded on any page:
 *
 * <div id="fos_comment_thread">#comments</div>
 * <script>
 *     // Configure FOSCommentBundle
 *     window.FosComment = window.FosComment || {};
 *     window.FosComment.config = {
 *         threadId: 'a_unique_identifier_for_the_thread',
 *         view: 'tree',  // optional, defaults to 'tree'
 *         apiBaseUrl: 'http://example.org/api/threads'
 *     };
 *
 *     // Optionally set a custom callback function to update the comment count elements
 *     const fos_comment_thread_comment_count_callback = function(elem, threadObject){}
 *
 *     // Optionally set a different element than div#fos_comment_thread as container
 *     const fos_comment_thread_container = document.querySelector('#other_element');
 *
 * (function() {
 *     const fos_comment_script = document.createElement('script');
 *     fos_comment_script.async = true;
 *     fos_comment_script.src = 'http://example.org/path/to/this/file.js';
 *
 *     (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(fos_comment_script);
 * })();
 * </script>
 */

(function(window){
    "use strict";
    
    // Helper function to serialize form data to object
    function serializeForm(form) {
        const formData = new FormData(form);
        const obj = {};
        for (const pair of formData.entries()) {
            if (obj[pair[0]] !== undefined) {
                if (!Array.isArray(obj[pair[0]])) {
                    obj[pair[0]] = [obj[pair[0]]];
                }
                obj[pair[0]].push(pair[1] || '');
            } else {
                obj[pair[0]] = pair[1] || '';
            }
        }
        return obj;
    }
    
    // Helper function to convert object to URL parameters
    function param(obj) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (Array.isArray(obj[p])) {
                    for (let i = 0; i < obj[p].length; i++) {
                        str.push(encodeURIComponent(p) + "[]=" + encodeURIComponent(obj[p][i]));
                    }
                } else {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
        }
        return str.join("&");
    }
    
    // Helper to get dataset value
    function getData(element, key) {
        if (key) {
            return element.dataset[key];
        }
        return element.dataset;
    }
    
    // Helper to trigger custom events
    function trigger(element, eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
        return event;
    }
    
    // Helper to parse HTML string
    function parseHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }
    
    const FOS_COMMENT = {
        /**
         * Shortcut post method.
         *
         * @param string url The url of the page to post.
         * @param object data The data to be posted.
         * @param function success Optional callback function to use in case of success.
         * @param function error Optional callback function to use in case of error.
         * @param function complete Optional callback function called on completion.
         */
        post: function(url, data, success, error, complete) {
            const formBody = param(data);
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody
            })
            .then(function(response) {
                return response.text().then(function(text) {
                    return {
                        text: text,
                        status: response.status,
                        ok: response.ok
                    };
                });
            })
            .then(function(result) {
                if (result.ok && typeof success !== 'undefined') {
                    success(result.text, result.status);
                } else if (!result.ok && typeof error !== 'undefined') {
                    error(result.text, result.status);
                }
                if (typeof complete !== 'undefined') {
                    complete(result.text, result.status);
                }
            })
            .catch(function(err) {
                if (typeof error !== 'undefined') {
                    error('', 0);
                }
                if (typeof complete !== 'undefined') {
                    complete('', 0);
                }
            });
        },

        /**
         * Shortcut patch method.
         *
         * @param string url The url of the page to patch.
         * @param object data The data to be posted.
         * @param function success Optional callback function to use in case of success.
         * @param function error Optional callback function to use in case of error.
         * @param function complete Optional callback function called on completion.
         */
        patch: function(url, data, success, error, complete) {
            const formBody = param(data);
            
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody
            })
            .then(function(response) {
                return response.text().then(function(text) {
                    return {
                        text: text,
                        status: response.status,
                        ok: response.ok
                    };
                });
            })
            .then(function(result) {
                if (result.ok && typeof success !== 'undefined') {
                    success(result.text, result.status);
                } else if (!result.ok && typeof error !== 'undefined') {
                    error(result.text, result.status);
                }
                if (typeof complete !== 'undefined') {
                    complete(result.text, result.status);
                }
            })
            .catch(function(err) {
                if (typeof error !== 'undefined') {
                    error('', 0);
                }
                if (typeof complete !== 'undefined') {
                    complete('', 0);
                }
            });
        },

        /**
         * Shortcut get method.
         *
         * @param string url The url of the page to get.
         * @param object data The query data.
         * @param function success Optional callback function to use in case of success.
         * @param function error Optional callback function to use in case of error.
         */
        get: function(url, data, success, error) {
            let queryString = param(data);
            if (queryString) {
                url += (url.indexOf('?') === -1 ? '?' : '&') + queryString;
            }
            
            fetch(url, {
                method: 'GET'
            })
            .then(function(response) {
                return response.text().then(function(text) {
                    return {
                        text: text,
                        status: response.status,
                        ok: response.ok
                    };
                });
            })
            .then(function(result) {
                if (result.ok && typeof success !== 'undefined') {
                    success(result.text, result.status);
                } else if (!result.ok && typeof error !== 'undefined') {
                    error(result.text, result.status);
                }
            })
            .catch(function(err) {
                if (typeof error !== 'undefined') {
                    error('', 0);
                }
            });
        },

        /**
         * Gets the comments of a thread and places them in the thread holder.
         *
         * @param string identifier Unique identifier url for the thread comments.
         * @param string permalink Optional url for the thread. Defaults to current location.
         */
        getThreadComments: function(identifier, permalink) {
            const event = trigger(FOS_COMMENT.thread_container, 'fos_comment_before_load_thread', {
                identifier: identifier,
                params: {
                    permalink: encodeURI(permalink || window.location.href)
                }
            });

            if (typeof window.fos_comment_thread_view !== 'undefined') {
                event.detail.params.view = window.fos_comment_thread_view;
            }

            if (event.defaultPrevented) {
                return;
            }

            const url = FOS_COMMENT.base_url  + '/' + encodeURIComponent(event.detail.identifier) + '/comments';
            
            FOS_COMMENT.get(
                url,
                event.detail.params,
                // success
                function(data) {
                    FOS_COMMENT.thread_container.innerHTML = data;
                    FOS_COMMENT.thread_container.setAttribute('data-thread', event.detail.identifier);
                    trigger(FOS_COMMENT.thread_container, 'fos_comment_load_thread', event.detail.identifier);
                }
            );
        },

        /**
         * Initialize the event listeners.
         */
        initializeListeners: function() {
            // Submit new comment form
            FOS_COMMENT.thread_container.addEventListener('submit', function(e) {
                if (!e.target.matches('form.fos_comment_comment_new_form')) {
                    return;
                }
                
                const form = e.target;
                const serializedData = serializeForm(form);

                e.preventDefault();

                const event = trigger(form, 'fos_comment_submitting_form');

                if (event.defaultPrevented) {
                    return;
                }

                FOS_COMMENT.post(
                    form.action,
                    serializedData,
                    // success
                    function(data, statusCode) {
                        FOS_COMMENT.appendComment(data, form);
                        trigger(form, 'fos_comment_new_comment', data);
                        const formData = getData(form);
                        if (formData && formData.parent !== '') {
                            form.closest('.fos_comment_comment_form_holder').remove();
                        }
                    },
                    // error
                    function(data, statusCode) {
                        const parent = form.parentElement;
                        parent.insertAdjacentHTML('afterend', data);
                        parent.remove();
                    },
                    // complete
                    function(data, statusCode) {
                        trigger(form, 'fos_comment_submitted_form', statusCode);
                    }
                );
            });

            // Show reply form
            FOS_COMMENT.thread_container.addEventListener('click', function(e) {
                if (!e.target.matches('.fos_comment_comment_reply_show_form')) {
                    return;
                }
                
                const button = e.target;
                const form_data = getData(button);

                if(button.closest('.fos_comment_comment_reply').classList.contains('fos_comment_replying')) {
                    return;
                }

                FOS_COMMENT.get(
                    form_data.url,
                    {parentId: form_data.parentId},
                    function(data) {
                        button.closest('.fos_comment_comment_reply').classList.add('fos_comment_replying');
                        button.insertAdjacentHTML('afterend', data);
                        trigger(button, 'fos_comment_show_form', data);
                    }
                );
            });

            // Cancel reply
            FOS_COMMENT.thread_container.addEventListener('click', function(e) {
                if (!e.target.matches('.fos_comment_comment_reply_cancel')) {
                    return;
                }
                
                const button = e.target;
                const form_holder = button.closest('.fos_comment_comment_form_holder');

                const event = trigger(form_holder, 'fos_comment_cancel_form');

                if (event.defaultPrevented) {
                    return;
                }

                form_holder.closest('.fos_comment_comment_reply').classList.remove('fos_comment_replying');
                form_holder.remove();
            });

            // Show edit form
            FOS_COMMENT.thread_container.addEventListener('click', function(e) {
                if (!e.target.matches('.fos_comment_comment_edit_show_form')) {
                    return;
                }
                
                const button = e.target;
                const form_data = getData(button);

                FOS_COMMENT.get(
                    form_data.url,
                    {},
                    function(data) {
                        const commentBody = document.querySelector(form_data.container);

                        // save the old comment for the cancel function
                        commentBody.dataset.original = commentBody.innerHTML;

                        // show the edit form
                        commentBody.innerHTML = data;

                        trigger(button, 'fos_comment_show_edit_form', data);
                    }
                );
            });

            // Submit edit comment form
            FOS_COMMENT.thread_container.addEventListener('submit', function(e) {
                if (!e.target.matches('form.fos_comment_comment_edit_form')) {
                    return;
                }
                
                const form = e.target;

                FOS_COMMENT.post(
                    form.action,
                    serializeForm(form),
                    // success
                    function(data) {
                        FOS_COMMENT.editComment(data);
                        trigger(form, 'fos_comment_edit_comment', data);
                    },

                    // error
                    function(data, statusCode) {
                        const parent = form.parentElement;
                        parent.insertAdjacentHTML('afterend', data);
                        parent.remove();
                    }
                );

                e.preventDefault();
            });

            // Cancel edit
            FOS_COMMENT.thread_container.addEventListener('click', function(e) {
                if (!e.target.matches('.fos_comment_comment_edit_cancel')) {
                    return;
                }
                
                const button = e.target;
                const commentBody = button.closest('.fos_comment_comment_body');
                FOS_COMMENT.cancelEditComment(commentBody);
            });

            // Vote on comment
            FOS_COMMENT.thread_container.addEventListener('click', function(e) {
                if (!e.target.matches('.fos_comment_comment_vote')) {
                    return;
                }
                
                const button = e.target;
                const form_data = getData(button);

                // Get the form
                FOS_COMMENT.get(
                    form_data.url,
                    {},
                    function(data) {
                        // Post it
                        const parsedHTML = parseHTML(data);
                        const form = parsedHTML.querySelector('form');
                        const form_data = getData(form);

                        FOS_COMMENT.post(
                            form.action,
                            serializeForm(form),
                            function(data) {
                                document.getElementById(form_data.scoreHolder).innerHTML = data;
                                trigger(button, 'fos_comment_vote_comment', {data: data, form: form});
                            }
                        );
                    }
                );
            });

            // Remove comment
            FOS_COMMENT.thread_container.addEventListener('click', function(e) {
                if (!e.target.matches('.fos_comment_comment_remove')) {
                    return;
                }
                
                const button = e.target;
                const form_data = getData(button);

                const event = trigger(button, 'fos_comment_removing_comment');

                if (event.defaultPrevented) {
                    return;
                }

                // Get the form
                FOS_COMMENT.get(
                    form_data.url,
                    {},
                    function(data) {
                        // Post it
                        const parsedHTML = parseHTML(data);
                        const form = parsedHTML.querySelector('form');

                        FOS_COMMENT.post(
                            form.action,
                            serializeForm(form),
                            function(data) {
                                const commentHtml = parseHTML(data);
                                const originalComment = document.getElementById(commentHtml.id);
                                originalComment.replaceWith(commentHtml);
                            }
                        );
                    }
                );
            });

            // Toggle commentable
            FOS_COMMENT.thread_container.addEventListener('click', function(e) {
                if (!e.target.matches('.fos_comment_thread_commentable_action')) {
                    return;
                }
                
                const button = e.target;
                const form_data = getData(button);

                // Get the form
                FOS_COMMENT.get(
                    form_data.url,
                    {},
                    function(data) {
                        // Post it
                        const parsedHTML = parseHTML(data);
                        const form = parsedHTML.querySelector('form');

                        FOS_COMMENT.patch(
                            form.action,
                            serializeForm(form),
                            function(data) {
                                const parsedHTML = parseHTML(data);
                                const form = parsedHTML.querySelector('form');
                                const threadId = getData(form).fosCommentThreadId;

                                // reload the entire thread
                                FOS_COMMENT.getThreadComments(threadId);
                            }
                        );
                    }
                );
            });
        },

        appendComment: function(commentHtml, form) {
            const form_data = getData(form);

            if('' != form_data.parent) {
                // reply button holder
                const reply_button_holder = form.closest('.fos_comment_comment_reply');

                const comment_element = form.closest('.fos_comment_comment_show')
                    .querySelector('.fos_comment_comment_replies');

                reply_button_holder.classList.remove('fos_comment_replying');

                comment_element.insertAdjacentHTML('afterbegin', commentHtml);
                trigger(comment_element, 'fos_comment_add_comment', commentHtml);
            } else {
                // Insert the comment
                form.insertAdjacentHTML('afterend', commentHtml);
                trigger(form, 'fos_comment_add_comment', commentHtml);

                // "reset" the form
                form.reset();
                const errors = form.querySelector('.fos_comment_form_errors');
                if (errors) {
                    errors.remove();
                }
            }
        },

        editComment: function(commentHtml) {
            const parsedComment = parseHTML(commentHtml);
            const originalCommentBody = document.getElementById(parsedComment.id)
                .querySelector('.fos_comment_comment_body');

            originalCommentBody.innerHTML = parsedComment.querySelector('.fos_comment_comment_body').innerHTML;
        },

        cancelEditComment: function(commentBody) {
            commentBody.innerHTML = commentBody.dataset.original;
        },

        /**
         * Serialize form to object.
         */
        serializeObject: function(obj)
        {
            return serializeForm(obj);
        },

        loadCommentCounts: function()
        {
            const threadIds = [];
            const commentCountElements = document.querySelectorAll('span.fos-comment-count');

            commentCountElements.forEach(function(elem){
                const threadId = getData(elem, 'fosCommentThreadId');
                if(threadId) {
                    threadIds.push(threadId);
                }
            });

            FOS_COMMENT.get(
                FOS_COMMENT.base_url + '.json',
                {ids: threadIds},
                function(data) {
                    // Parse if string
                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }

                    const threadData = {};

                    for (var i in data.threads) {
                        threadData[data.threads[i].id] = data.threads[i];
                    }

                    commentCountElements.forEach(function(elem){
                        const threadId = getData(elem, 'fosCommentThreadId');
                        if(threadId) {
                            FOS_COMMENT.setCommentCount(elem, threadData[threadId]);
                        }
                    });
                }
            );

        },

        setCommentCount: function(elem, threadObject) {
            if (threadObject == undefined) {
                elem.innerHTML = '0';

                return;
            }

            elem.innerHTML = threadObject.num_comments;
        }
    };

    // Check if a thread container was configured. If not, use default.
    FOS_COMMENT.thread_container = window.fos_comment_thread_container || document.getElementById('fos_comment_thread');

    // Get configuration from FosComment namespace
    const config = window.FosComment && window.FosComment.config;
    
    if (!config) {
        console.error('[FOSComment] Configuration not found. Make sure window.FosComment.config is set before loading comments.js');
        return;
    }
    
    // Set the base URL from config
    FOS_COMMENT.base_url = config.apiBaseUrl;
    
    // Get thread id and view from config
    const threadId = config.threadId;
    const threadView = config.view;

    // Load the comment if there is a thread id defined.
    if (threadId) {
        // Store view in global for compatibility with getThreadComments
        if (threadView) {
            window.fos_comment_thread_view = threadView;
        }
        
        // get the thread comments and init listeners
        FOS_COMMENT.getThreadComments(threadId);
    }

    if(typeof window.fos_comment_thread_comment_count_callback != "undefined") {
        FOS_COMMENT.setCommentCount = window.fos_comment_thread_comment_count_callback;
    }

    const commentCountElements = document.querySelectorAll('span.fos-comment-count');
    if(commentCountElements.length > 0) {
        FOS_COMMENT.loadCommentCounts();
    }

    FOS_COMMENT.initializeListeners();

    window.fos = window.fos || {};
    window.fos.Comment = FOS_COMMENT;
})(window);
