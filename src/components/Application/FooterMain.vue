<script setup lang="ts">

</script>

<template>
    <footer class="footer is-fullheight">
        <div class="container-fluid">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                © {{ (new Date()).getUTCFullYear() }}, Domain Designer
              </div>
              <div class="level-item">
                 <a href="https://github.com/web2solutions/domain-designer" style="height: 20px">
                  <img src="https://img.shields.io/github/package-json/v/web2solutions/domain-designer/main">
                </a>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <div class="logo">
                  <img src="@/assets/minds.svg" alt="Xpertminds">
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
</template>
<style scope>
footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  overflow:hidden;
  z-index: 9999;
  opacity: 0.8;
}
</style>
