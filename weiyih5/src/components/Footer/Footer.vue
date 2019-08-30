<template>
    <footer class="al-footerBar" data-alcode-mod='382' >
        <a href="/" class="al-footerBarItem" :class="active(0)">
            <img :src="isShow(0) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAA51JREFUWAntmF9I01EUx8/ZZopSVGA56aG33MyQ6qk/D2FRD/VkWQ9RSW5SIb0UClJab9lTGME2RTKRKOhFgwoFqd6EUrI2egiD2H4aVBSZpPudzp1/2J/fdu/2m03K+7Df/Z37ved8dnZ/9579AFba0mYAs+WeiNDREXKhDtUEWMmOwwQwiki9fnfpvWzFyQpwZVdo8/QM9QDBbiMwBBwssNlOvT5bHDQaT8dmGnhb5+ctv8MzAwy7KXVg/FCwCqpGau3jqXWpR00BV3i0ihmgAQDakDrM/CjCJ4C8qoC7+L2S3kBkMbApmbZ2BnfOoj6kDCu88q+AMPtcfFGlIAaijDJc7pncE4bwYyZYY+BTakKELxbAQ2/d9mGpOE6QdoYd3on9Osw+zRRWxCeC9WGAQadvcm8cj/Q2LeAyr3aYKNzP21Wh1LNMQLSa9NknDt/EAZk0elwZ2OkN1SDRI56cH+3ATF98cdLDfSIRqn6UgMs8odM6QC8B5ak6TkOXLxJR7gsdVZkjBXZ4QucAoYsXnlXFYSYakQg+Fu87fcGTsvkpgXkZXGJndxg2o91EFjxmnBOi63jX4dHqYuxxN0mBy3yhFp3oZpx+iW/JQkhep1drSBbIMHO8DNo4s5eTTfobdq4/Gv319rb4WDHAouJy+rTbfD0fL8zJvQVbAy77tejYi8DHHpD1zTetg9frmWhBrvuIeMPvtjctcESAd3gobwq1Hs5szcLAsroitvtdJRcZniIP3RRot5YtrMgcUYPTN3FddCPA/GQeETeicWHSOddbDp/Yt0BBpNeKfgTYSpZGJh3mlDe9c9ldC6JcX4ugpJq52nnHCCFaIlvs4kMXDVfmCfIxn/sWqC9N4ItkOPdo6gQrwOq5yky5kuHM8qY+6//OMB86PovVtn3dOnthERSsBbAe5H3ppXr+5EqbXCJX8IHzk9+nnfC7S/qj1L+4/4yLqsGxr1oLl6tXosYy7mZpSWBzIBZ2EehhDYa5rr3KpxW/xzDfsgEcOO7a2C5FsdIFqUZBYBqY1+2LVuSXrJLmryv9yKXVuEQmHTYNzMXJqDTKvACBRlS1yXTmgYm+J3OeYEf8kWBL02AeOM2AZuX/CDDCtNlMmJ6fhCHZwfGKA+5SCcqvTru54O9W06b1v0AwJDTDJWFDbOYtSLpVJXjLmgH1OYZEh4bAYy77EFppn9hjuRaYSpy2NBYRKxKTYwuGpYmy4jV1Bv4Az54V7gsvUo0AAAAASUVORK5CYII=':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABNlJREFUWAntmVtoVEcYgPeSTSRFLSagDaUNPtjGIKj4YlobttpQEmMum/VBatWHIBbEF6uBUpqm9KHtU237EpQ+aIOQzY1FcZum2FoVMRSLoogoKcVeqC1K6rom2U2//3jmcDZ7stmzezZriwOzczn/zP/NP//MmTnrcj0J+bWA26nup6en3f39/e2kAfpcTYyT/8nj8fQEAoGjTulxBHhgYKAyHo8fA/AlKzC32z3i8/nebGpq+tXquZ26nIGHhoZemJyc/AbYZ9MpBvqW1+vd2NLSMpZObq5nnrkE0j0fHBxcBez3JtgJ5DsAW4orVADZRTkufSCznFk4g9uskHK2IWsLh0KhdUBEULxEVx4DMNDW1nbSDNPb2xuk/BXRp9f/gXu81tzcfNksl2k+K2Cs9DLWOoGSRbqi+1h1S2tr67dWivv6+hoSiUSIZwv0538zA6+zGC9ayaers+0SKN+EcrGsgr1Hvm42WFEO2AkG1ED2vpQJS5idEay/4VEx819bFkbBZqY9hLISUUH+L2IdQD9mopKZWc9gT9L+ab19FEs3M9jhTNqLTMYWxme3It+vYMn/TqzNFBZZF2DnSV4l3pEyfZUygLAYQsqZhIwsDOwOOj9Ch17pFKv+QrKRBXZDynYDu8vKqakp2Qqf0dtOYultDF78PG2Y08LA7qGHL4kK9ibAG7KFFRp2iKsktfrApcqHpY+j6w0ppAtpLcxU7afxJ6oDFFxjS9rkxBtL+tTfkCNYermuI4Gld2Ppw0rnzHRWC7MbvIewAUv+Umlpaa1TsAIib72SkpJXyF6XMsEDfDe69z4qpv5aAjM1HzNFnUocy14oKiry19fX/6nqnEobGxtvFxcXi3tckT4BdqP7ENAHrHQkuYQIA/s5gm+ZhL8rLy/f7Pf7/zHVOZ5lyysD9GsY1qrOcY9O3ON9VZbUAEbQy6gOk+5UAow6UlFR0VJTU/NA1eUzDYfDz8VisZ/NOoD+COgOVae5xOjoqA/Ynhmwg1VVVVvmC1aAsPBDBaZS6g6y+A/BphlXAx4bG/uUCnkxaAHL9pSVlQWrq6vl9PU4hL24apeAqEXXqKiAPcIUbMdnp1RdoVJYwibduySvAfPgIPEi5Q5g28knTIIFy1ZWVsp16zN4fiNqW6yx6ApGZVLM7WXpxMSEnFG0EAwGU/iUSyiZxz4tsiLEwTtYhPuYhmOcGd62kilU3WwW7gRoGdD7h4eHFxcKzkqvJTCg2gFdGkSjUXWtsWo/73WWwPNOYUPhfw7YctHZGHCSKIu1nYo9uFQV6UMW7QXOAh9wNfohSTCHgiMWjkQiTwEbBrSbuAYe8fvF5Ov4HHCas8C7OTAmNXUEeHx8/EPgZrtIytWqi8NVQ5LmLAs5A2PZF4E1bgi4QTeH/XXyHQ0muSVrAZkvVD6X1Akflo8hauCneNHsVkDc2eq5HcvNuhzg5+UOV9CPgQIGiHwL1gILzHy6kjvbXSxuLDj82ZBVbeymyjJ22xnyAC00Ci7XuCmvskbdDFn13FaaM7AtbQ4I/2+AY8oY+N0ylc93OkOXwWDWm3JAlodsVWdZTDVmwfnO4+/n2HFS/jOxdAlg3wGwkNekhM6QYidLYK4mp9mi/IzyDDGa0ipPFaJLdIpuYciTmifdprXAv6H62B/3npbsAAAAAElFTkSuQmCC'" alt="">
            <figcaption class="al-footerBarItemTitle">
                首页
            </figcaption>
        </a>
        <a href="/dist/discover/discover_index.html" class="al-footerBarItem" :class="active(1)">
            <img v-show="!animates" :src="isShow(1)?'data:image/png;base64,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':'data:image/png;base64,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'" alt="">
            <div v-show="animates" ref="lavContainer"></div>
            <figcaption class="al-footerBarItemTitle">
                发现
            </figcaption>
        </a>
        <a class="al-footerBarItem al-release" @click="awakeApp">
            <figure class="al-releaseBtn">
                <img src="data:image/png;base64,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" alt="">
            </figure>
            <figcaption class="al-footerBarItemTitle">
                发布
            </figcaption>
        </a>
        <a href="/dist/message/message_index.html" class="al-footerBarItem" ref="message" :class="active(2)" @click="login">
            <img :src="isShow(2)?'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAA5lJREFUWAntmU9sDFEcx99vZquqjZSSdrfEoQfb3VbSKIkEh16UpCIRIaEipVuacKU4OBCOQoJulwNx0MTBRbdn4qIc6LZ1cMLulMpupLVlZt7Pe1jZXbNvZnZn2oq+y8x7v9/v+/vsb96bP28J+ccaOM274a5SqaZpFAnxyzLpjB3zRZ3MITkpxrW0WdzOYLey01U6hRNO6zsK3HTn81pE0poF6W2MxNdl9Us+LXlKBAeUNh2xExA7WGVrjIiAgIJAojIhN2Ih73MjH6tjRQMHIh9bkOq3EHGz1WTcjyV8CgDHx0LemJ24jG9RUyIYThyhVHtmF5Yn5fMbCb4MDChnMxB2jrYqvG8Q5dGUco2B9tpJUtAXpP4D3bW9FwBoQZ88gyevL+zGkomLrELOwPJMSHseDChMkli+m1iucDCidOgUHxFky8fhBkAOj4d896zIWkrecvuTb1ZXY+yWVW1F1K4PW4QzMkgNo921k2axlhbdrK6dcguWA7I1UakhPWcGy+2mFd4yiBWpVOI9A15pRbAEn2+VpGrNi57lUyIN0wonU5OH5gCWM5an4etuESy3mQIDwTYzEafsFHGPmZYpMLvnBMxEHLMDtphpCYH5g4KtiPVmIo7ZEXzBQVwi0hMCjyWT9Sy4XCTgrA0l+iXhFWkKgaUy1daTUJTIqs0jsdd+QRMCC+JcM6EqvtUKgc2CXaMWCAuBBXHzZloEdrv0ixUutcIos7djQRNW2CxYoOuaSQjsWtYShIXAkk4rStAuKtQspxBYA9pXVNYSglSgp0XhBSd4MBJv13UyJAp2yyaD3B4L1Q4b6RsCN99PrVBn0qPs1dJnFDQHYx/KqpY1vz5YnczPZTgltOn0zXmE5Yz1PxnyaVn/L+BAWOliW0n7DXzndIgzcJb8pDlTorl/yq+BOsI/u/Md56PP9yvKZM/GV0dXv8nkz6mwCt8jCwWWA3IWVVevZ2D5MQeYIDRlGxfI+aZsjhxg9hTnW6DCjYzsYLfP2Ub4NAE4n50nZw5nG+ycN4YTj9nl2/krRuqb6Km7kon39ytnCKGXeZ/NyaHxkHdXxlbM0ZmPTICHbML9BsZLjeF4Hbt0T9im7zb2Q07+AeN+JTZHKswZ/OF4lG2v7yjIA2R4IuRrL2i3aMiZwxZjDN2WLJX2sl9/lV34vN10oHyc2w0DbQ46VuFMXv7Xl65prUBoAxLprezxjIx21bzL2P+74w8WnhyilbcEoAAAAABJRU5ErkJggg==':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABJJJREFUWAnlmVtoVFcUhpOZdMSEQCs+6EiR4ENNU8Ti5SEYH3yoGmhzp4hVa1WigoIXaL08WupTK5ZqW/ShBNpC7iS1CbQPXki9DC1qB1KkJFUIKupDUMx9/LacNewZz9ln53imVTpwWGvttda//qy9zzn77OTlvWS//LD59vb2Fg0PD/eAuzAajW6ora1Vemi/SGhIDhBkV6Ku4Jo9OTm5I2z80Ann5+fPEJLoc1tbW+eLHYYsCAPECyOVSi3jGmxubr4N+R6uE3V1dVe84m3GA6/h9vb2xUz5eop8W19ff0OKtbS0LILkVbFd5AWIbycn6eLzHQq0JJjmDycmJn6D2H6uc3oViFyLRCKbIfUD10V8D3Q/+gpyfqfrB7PGrcxpdZhCUTp4HOSdgg6pK5BcLna2JCfCbFRMTU1twLcJW1+G35C7E4yp7DwvW0/2ikmP09kjGDrZPwoKCurSAS6KQ+YsrrMdHR2fMzNfQ7rCCW0EM4Vu/TSx7jCdfRfgToo9zYFIUzwebywvL3/sFLcSiUTilcHBwZPgbJEEltBGbsYmsU3SinBnZ2d8fHw8SZFXFRhk25hKY2dNRZWPBnwP3jon7lEsFltQVVV1xy/P6qZjGndrZG8UFhZu9gP28zM7qsPXnbiisbGxQ345yu9LuK+vbyY3zDYBg/iOysrKYbGDSrWUWAp7tfzGrq6u2ZrtqvoSHhoa+oDMWU729YaGhl9dkQIMsm5/YXmdd1Jjo6Oj7/nB+BKmo6sEhI58JXpYEsI/aljVmu6q+hIG8E3JhPwF0UOUP2lYb2u6q2okDMEoWW+oTIhPlJaWpl/BrmgBBtl+3gR7VKVSL55MJmMmGCPh7u7ueYDI7uufsrKyMRNYEB9kKZG65eRG+vv755pwjIR51OhvwtDJCjFIj4uOVLPq+TMS5iazerF4ogdw+NU0Eg5QL+cpLwRhtYht/1JrwtMBtS0eJM6acBDwXOQYCfvdALkg5IdpJMymx3pt+RWy9fs1yUjYL9mWRJhxRsJhFgoLy0iYJ8NMKcTbyPpDUXJspXo9S6xeU8Z0aSTMl8YBCQboT9FzINPYfIp9bML3JNzW1rYGkvLNlcfX8RcmoOf06djr+d5b7YXnSphd2muc6pyWJKbsu5qamstihy35oL1EjSbBpVGnFQexdelKeGRk5CRBcRUI0F2eFvv0pFzo1NijajnY8xwOz5R6hjDT8RF/4fsSib6FTfZ9sXMlnRpbBV9xUFzEFpmxfSRgIYEJnEVOwKmSkpL0SY8k5VIODAycAF+Iq/OKJZxX/CU19Q26GjvFJWSVvRUASVb2v/1T5xVfUvQdKZyxJOjuW+J4USTrepnOJYMwC18dgd7TA/5j/SH1D+scMtaw7piOzto/w+ysVTl05ACPqaOSj+8TfJ85vp/xVYoviMxew0EwFMlWIYz8FJJzADrPVYG9S0BVnOhBZSgdVsUh2QM5zzcUZHvp7pqgRCUvYw3LYBBZXFysjl+PcWVvkpR9zPEHgc7ICa3Dgsop++u81pey+V/ATfw3/1xMVFdXy0GJhP1/5BM+nJd7A4NsnQAAAABJRU5ErkJggg=='" alt="">
            <figcaption class="al-footerBarItemTitle">
                消息
            </figcaption>
            <!--<i class="al-newsNum" v-if="specialCount.messageNum&&specialCount.messageNum>0">{{specialCount.messageNum < 100 ? specialCount.messageNum : '...'}}</i>-->
            <i class="icon-newTips" v-if="isHaveMesg"></i>
        </a>
        <a href="/dist/personal/personal_index.html" class="al-footerBarItem" :class="active(3)" >
            <img :src="isShow(3)?'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAA2VJREFUWAntmE9IFHEUx9+b1SQviUrtIgRRkbpeQjom9McIKvKSRHQo8s8xSoiOnYOgLtWaHrpE5aUoiKhACoIOIoSt0K3AdldIStJUnHm9N8KU6+7M74272xD9YGHn93u/7/vMm/f7/d4MwP9W3ghgKeSJCFuHM3vRweMOQQeLNgFSAxB+JYApC+E1WfQ4fS7xBhG5K3xbN3DLYO4gkH2VKXYHYbCzccDYpcm+LS+DbIuNhwY+8ZBiE98y14jgfDHxYv2IcKOtLjEw0o12MZti/aGAV2CzjzgVjhYTDurn1HjaVhfv0kJbQcKFxlciGx5WNOVmRaeQvl+fOsKSs0T2Cz9RzRhirFOT06oIy24gC0wDFGgrC1Z0DZsKWLYuk93A0LdrJnqiazpHBQyO1WUqrLGT/dvUXgXMj844EqYAYieHjam9CpgTrclUWGOn0VUBu8ethsTUVo5xw6YD5trAUFdnptBVAfOKntKRmFlrdFXAUnWZIeisNLoqYCkRdShm1hpd4xNGXMuJ1DqYGSvl4cEA4+m+RLtpnayKsCvK9axZ3AytWM8UVhRVwDJBChWpZ+X/epvoaAof8acGlkk2bbjNUfko/0M3hLdSxGvnq3I4OZjZw8foZc5hriko1M2uAkR8b1l4Md0Tf7Wq3+fCCLj57mwDLsxfJ3BO+2iFHuKndd+qjl34cHZzNkgkEDiZyuxzAO4RUDxIbD3jCJjlX1e6P/7OT8f3sSaHsscY9nm5YQVQfDjojCZT2VN+wEUj3HIn10mO/YQn1/gJlH4MHY7iyXR/YqSQdkHglqEvHWDDM15ctYUmVaBvscrCwxO9idF8X2uA21OzjXPwY5ING/ONK3nNe/SMVV2VzF+Ia3J4Hufk1fuvwkpg+ANNvbO0fCs/SKsiXOpX+HxnYa4twO4/89mL8BXig4Dsm2FEyzmH1xGj/f4M4AE/GJo+wIM7y+k8jDZvd61twznvk5gHzFvYmTCClZjj2OR9cHRzuD01s2kOFjLsfGMlALQ++ARcroWaxrH++u9uhBdg6UhUYeXmOC2qfsLiIfnvAtvgJOUiyo2X3X7hc4E55M1Rhl1ho+0eMCDsij4wbvOAeZ/bEX1g2uoB81YxHXlggpwHbGGsl6E/RxWa30g+EcR6osr3b3H9AjBWE9O5984zAAAAAElFTkSuQmCC':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABNNJREFUWAntmE1oXFUUxzMf+SiUFkxFaFUoSg3JQrpyIdpSrSA2nWSSdONmNm4sqFBaqAtBBQuFllZEcSGUgojmgxkLIZCuahddFCJCJIourKRiaRcmA6H5Gn/nec/jOH3fTToKvXA55957zv/835n77j1v2toets3NQG4j4BuNRm5iYuIFZAm8F+m70Ltzudwd9Hn6FfRauVz+DtlgnLndN+Hx8fGXIXeavjeOBWRn6CeGhoYux9mGrWcmDMECZM8g3w4DD5uH9HlIH0OuhdmEzefDFqLmHdlqE9k6BD7J5/MH6Tt7e3s7RcpY5sGrK6b48bDiX9C5pDJThsfGxs5ZshD6pr29/a1SqfRnWOBarfbYysrKx/gdURv8zg8PD7+j4yQyNWHZs+vr69MG/NTIyMi7Zhypjo6OfoTBSTWSXyDNnk61JchOjn5ag0lm05AVP7EXP8UQPMHVcZxMRdgdXXoa1GUbxAUIWnd+3p6G7F7BDbILmktFGPABBSFLF6L2rNoFSfETf10DV87vRC0VYRD9TBCwlihCiFGTv1w2iVpawrsM6qzRs6jW3+JGYqUizE/XrWg9PT1y7WZu1t/ixgGmIszP6JOcm5vzyccFCVq3/hY3yNbOpSKMoxQy2vpUySitv8WNhEtL+IqipXmz1cfKJn8f19oE6akI2zebgBW5boNA4+bET/zVzuLqXJhMRdjVszMObKvUBmHAUfPOb6vYQHZGcKPs7VoqwoA36CcUgCwdcbWBTsVKsRc/NRQ8wdVxnEx8h1ug/1W1JsTJkBTvUs8eMg8i9fAFutyAs3LOuqOrD7sSvcK8tw3EhyrtKlthP/apivhMGZaAjnSmLw7xlwbZ6/RjlJeJT4nMhP8J2dYm9THkE33T4XObvkN9jbxYKBSOk/FbZi5QjSXMEbRzeXn5KerY0DcZwvrVLNWcFEjNX83ytVyV06BarT67urp6FJvX6Vvo2m5iU+IL5LpOBMlIwrzRr+JUpXfQ34P0h0EgWeYg/gTH21l8h43/EqQrkPYLfLPmqaHHGkX1ASwm6EJW9tvjIjeqDQwM/E4CRsA9DOZfDncLv9ZXJKocFieQMPvy+bW1tW9x6nKONzo7Oz8IA7mfebJ5qaOj4zmI/+xwhNOXkPZrb4t/z5aYmpp6ZHFxcQ6jR53hfLFY3Dc4OPirddxo3b0rV8HdLdg8wB0+pfqav2ruyXC9Xj+DvZK9zdO/tNlkhSDEbhLrFVQ5SeTY7GaPfyq6bf8iLPsWw4oa8JRHAfpJx5stifULMd/QOHApc6sO6VikT5jFPP83fKaLOFaj3la122hJTDmVLhrc9+Hmb12fsMvuHmcox8ubxumBql1dXfLfxV0JCtk+svyaEvAJk92KTmL8NdflHzp+0LK/v38eol9oXPj4fzh6hCcnJ7ex6J99GHyuxq2ScLAv3P7p6entwsUjvLS0dAjduyYxnCW711pFVOOyl2fh4p3NZLu4sLBwUNZ0S/gfhCzKWfifaHC5pETQD4juEWbwjC7wVN+r3mpJBfeDcoDj06Jrhnt0AanfbGaqNSoHwY8msncDFt2Ex150nuQa97ixa50KFxv8SRlohmMLZ+vZCp2t6v27r4TlOrzRCiJJYkL2N+z8KzuJz0ObrBn4GyFI9u0Yy+pwAAAAAElFTkSuQmCC'" alt="">
            <figcaption class="al-footerBarItemTitle">
                我的
            </figcaption>
            <i class="icon-newTips" v-if="specialCount.draftNum > 0 || specialCount.fansNum > 0 || specialCount.preferNum > 0 || specialCount.collectionNum > 0" style="right:30%;"></i>
        </a>
        <button class="al-footerBarItemBackToTop" style="display: inline-block;" v-if="isToTop&&isActive==0" @click="toTop">
            <figure>
                <!--//img50.allinmd.cn/pages/index/back_arrow.png-->
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAOCAYAAADaOrdAAAAAhElEQVR42qzUUQ6AIAgGYG9SepYO3jyJehHS4oHMJb/KxtyY+L0ghogMkDan51PdhwKBnogIhACR3qGGUCDlPPhUQyjguO5EPYo6jPQeUkOjAHRvBlDf7zXYgen7QDWQRv5BD1oF/E5jDYQJoLUZbsjwLloFtCBfCnvOcyEgofLudgkwAMmVXQSCDaXZAAAAAElFTkSuQmCC" alt="">
            </figure>
            <figcaption>
                回到顶部
            </figcaption>
        </button>
        <small-screen :attachment="attachment" :isSmall="isSmall"></small-screen>
    </footer>
</template>

<script>
    /**
     * @Desc：公共页脚导航
     * @Usage: 直接添加使用该组件
     * @Notify：
     * @Depend：原页脚带有更新状态及个人中心收藏、草稿等状态。[个人中心页状态待完善]
     * :isActive='0' 0-首页  1-发现 2-消息 3-我的
     *
     * Created by dinglindong on 17/11/23.
     *
     */
    import TempCache from "static/js/tempcache.js";
    import commdate from "static/js/comm.date.js";
    import comm from 'static/js/comm.js';
    import user from "static/js/module.user.js";
    import commPopup from "static/js/commPopup.js";
    import app from 'static/js/comm.app.js';
    import axios from "axios";
    import SmallScreen from "./SmallScreen.vue";
    import bodymovin from 'bodymovin';
    import * as animationData from "static/js/assets/discover.json";
    export default {
        props:['attachment','isSmall','isActive'],
        data(){
            return {
                isToTop:false,
                isIndex:false,
                isFind:false,
                isMess:false,
                isPersonal:false,
                specialCount:'',
                animates:true,
                defaultOptions:{animationData:animationData},
                isHaveMesg:false
            }
        },
        components:{
            SmallScreen
        },
        mounted(){
            let t = this;
            if (TempCache.getItem("userId")) {
                t.getSpecialCount();
            }
            t.scroll();
            if(TempCache.getItem('isFirst') && TempCache.getItem('isFirst')==0){
                t.animates = false;
            }else{
                if(t.isActive==0){
                   var animation= bodymovin.loadAnimation({
                            container: t.$refs.lavContainer,
                            renderer: 'svg',
                            loop: 1,
                            autoplay: true,
                            animationData: t.defaultOptions.animationData,
                        }
                    );
                    animation.addEventListener('complete',function(){
                        t.animates = false;
                    });
                    TempCache.setItem('isFirst','0');
                }else {
                    t.animates = false;
                }
            }
        },
        methods:{
            scroll(){
                let t = this,
                    scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop>0){
                        t.isToTop=true;
                    }else {
                        t.isToTop=false;
                    }
                },false);
            },
            toTop(){
                // document.body.scrollTop = document.documentElement.scrollTop = 0;
                scrollTo(0,0);
                this.isToTop=false;
            },
            active(index){
                if(this.isActive==index){
                    return 'active';
                }
            },
            isShow(index){
                if(this.isActive==index){
                    return true;
                }
            },
            login(e){
                e.preventDefault();
                let t=this;
                user.privExecute({
                    callback: function() {
                        g_sps.jump(null,t.$refs.message.getAttribute('href'));
                        // window.location.href=e.currentTarget.getAttribute('href');
                    },
                    operateType: "login"
                })
            },
            awakeApp(){
                if (TempCache.getItem('customerRole') != 3 && TempCache.getItem("customerRole") != 2 && TempCache.getItem("customerRole") != 4) {
                    comm.creatEvent({
                        triggerType: '发布',
                        keyword: "发布",
                        actionId: 32
                    });
                    var id = TempCache.getItem('userId')||'';
                    var amChannel = comm.getpara()._amChannel;
                    app.newReleaseBox({
                        imgPath:"//img50.allinmd.cn/case/release.png",
                        title:"发布内容需使用唯医骨科App",
                        solidBtnTitile:"立即使用",
                        authNoneTitle:"暂不发布",
                        data:{
                            el: ".solidBtn",
                            ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                            ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                            android: "allin://com.allin.social:75235?data={scene:11,type:51,userId:"+id+ (amChannel?",_amChannel:"+amChannel:'')+ "}"
                        }
                    });
                } else {
                    commPopup.popup('该用户没有操作权限');
                }
            },
            getSpecialCount(){
                let t=this,data = {},
                    localTime = commdate.local_time();
                if (TempCache.getItem("userId")) {
                    if (!TempCache.getItem("readCollectionTime")) {
                        TempCache.setItem("readCollectionTime", localTime); //第一次登录后进入网站记下时间
                    }
                    if (!TempCache.getItem("readDraftTime")) {
                        TempCache.setItem("readDraftTime", localTime); //第一次登录后进入网站记下时间
                    }
                    if (!TempCache.getItem("readTrendTime")) {
                        TempCache.setItem("readTrendTime", localTime); //第一次登录后进入网站记下时间
                    }
                    if (!TempCache.getItem("readFansTime")) {
                        TempCache.setItem("readFansTime", localTime); //第一次登录后进入网站记下时间
                    }
                    if (!TempCache.getItem("readPreferTime")) {
                        TempCache.setItem("readPreferTime", localTime); //第一次登录后进入网站记下时间
                    }
                }

                data.readCollectionTime = TempCache.getItem("readCollectionTime"); //上次进入我的收藏的时间
                data.readDraftTime = TempCache.getItem("readDraftTime"); //上次进入草稿的时间
                data.readTrendTime = TempCache.getItem("readTrendTime"); //上次进入朋友圈的时间
                data.readFansTime = TempCache.getItem("readFansTime"); //上次进入粉丝列表的时间
                data.readPreferTime = TempCache.getItem("readPreferTime"); //上次进入赞列表的时间
                data.platformId = TempCache.getItem("department");

                comm.ajax2({
                    url: "/mcall/customer/message/getSpecialCount/",
                    type: "post",
                    data: {
                        paramJson:JSON.stringify(data)
                    },
                    timeout: 30000,
                    success:function(rep){
                        if (rep && rep.responseObject &&rep.responseObject.responseData) {
                            if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                                let list = rep.responseObject.responseData.data_list[0];
                                t.specialCount = {
                                    collectionNum: list.collectionNum, ////新的收藏数
                                    draftNum: list.draftNum, //新的草稿数
                                    fansNum: list.fansNum, //新的粉丝数
                                    messageNum: list.messageNum, //新的消息数
                                    preferNum: list.preferNum, //新的赞数
                                    trendsNum: list.trendsNum, //新的朋友圈数
                                    focusRemindNoReadCount:list.focusRemindNoReadCount, //[消息]关注数量
                                    reviewNoReadCount:list.reviewNoReadCount,           //[消息]评论数量
                                    remindNoReadCoun:list.remindNoReadCoun,             //[消息]提醒数量
                                    preferNoReadCount:list.preferNoReadCount,           //[消息]赞了我的
                                };
                                comm.ajax2({
                                    url: "/mcall/customer/message/getMessageCountInfo/",
                                    type: "post",
                                    data: {
                                        paramJson:JSON.stringify({
                                            customerId: TempCache.getItem("userId"), isRead: 0
                                        })
                                    },
                                    timeout: 30000,
                                    success:function(res){
                                        if (res && res.responseObject &&res.responseObject.responseData) {
                                            let lists = res.responseObject.responseData;
                                            if(lists.isReceiveRead==0){
                                                t.isHaveMesg = true;
                                            }
                                            if(lists.isReplyRead==0){
                                                t.isHaveMesg = true;
                                            }
                                            if(lists.isNoticeRead==0){
                                                t.isHaveMesg = true;
                                            }
                                            if(lists.isofficialRead==0){
                                                t.isHaveMesg = true;
                                            }
                                        }
                                    }
                                });
                                t.$emit('specialCount',t.specialCount);
                            }
                        }
                    }
                });

            }
        }
    }
</script>


<style scoped lang="scss">
    .icon-newTips:after {
        top: 0;
        right: 30%;
    }
</style>