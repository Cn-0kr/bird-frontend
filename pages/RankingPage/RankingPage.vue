<template>
  <div class="ranking-container">
    <div class="bird-item rank-1">
        <div class="rank-number">1</div>
        <div class="bird-info">
            <h2>东方白鹳</h2>
            <div class="details">
                <p><strong>地区：</strong>东亚地区</p>
                <p><strong>习性：</strong>群居性水鸟，善于飞行和涉水觅食</p>
                <p class="description">东方白鹳是一种大型涉禽，全身洁白，翅膀末端呈黑色。具有重要的生态价值，是国家一级保护动物。</p>
                <p class="search-count">
                    <strong>近期搜索量：</strong>150,000
                </p>
            </div>
        </div>
        <div class="bird-image">
            <img :src="storkImg" alt="东方白鹳">
        </div>
    </div>


    <div class="bird-item rank-2">
        <div class="rank-number">2</div>
        <div class="bird-info">
            <h2>朱鹮</h2>
            <div class="details">
                <p><strong>地区：</strong>中国陕西洋县</p>
                <p><strong>习性：</strong>栖息于山地森林，觅食于水田和沼泽地</p>
                <p class="description">朱鹮全身粉红色，被誉为"东方宝石"，是世界珍稀鸟类之一。</p>
                <p class="search-count">
                    <strong>近期搜索量：</strong>120,000
                </p>
            </div>
        </div>
        <div class="bird-image">
            <img :src="ibisImg" alt="朱鹮">
        </div>
    </div>
    
    <div class="bird-item rank-3">
        <div class="rank-number">3</div>
        <div class="bird-info">
            <h2>丹顶鹤</h2>
            <div class="details">
                <p><strong>地区：</strong>东北亚地区</p>
                <p><strong>习性：</strong>善于舞蹈，多在沼泽地和湿地活动</p>
                <p class="description">头顶鲜红，全身洁白，象征着吉祥和长寿，是中国传统文化中的瑞鸟。</p>
                <p class="search-count">
                    <strong>近期搜索量：</strong>100,000
                </p>
            </div>
        </div>
        <div class="bird-image">
            <img :src="craneImg" alt="丹顶鹤">
        </div>
    </div>
    
    <div class="secondary-ranks">
      <div class="bird-item rank-4">
        <div class="rank-number">4</div>
        <div class="bird-info">
          <h2>黄鹂</h2>
          <div class="details">
            <p><strong>地区：</strong>华东、华南地区</p>
            <p><strong>习性：</strong>栖息于森林和果园，鸣声优美</p>
            <p class="description">体型娇小，雄鸟黄黑相间，有"黄衣公子"的美称。</p>
            <p class="search-count"><strong>近期搜索量：</strong>80,000</p>
          </div>
        </div>
        <div class="bird-image">
          <img :src="orioleImg" alt="黄鹂">
        </div>
      </div>
    
      <div class="bird-item rank-5">
        <div class="rank-number">5</div>
        <div class="bird-info">
          <h2>金丝雀</h2>
          <div class="details">
            <p><strong>地区：</strong>全国各地</p>
            <p><strong>习性：</strong>善于歌唱，性情活泼</p>
            <p class="description">羽毛金黄，歌声婉转动听，是受欢迎的笼养鸟类。</p>
            <p class="search-count"><strong>近期搜索量：</strong>75,000</p>
          </div>
        </div>
        <div class="bird-image">
          <img :src="canaryImg" alt="金丝雀">
        </div>
      </div>
    
      <div class="bird-item rank-6">
        <div class="rank-number">6</div>
        <div class="bird-info">
          <h2>燕子</h2>
          <div class="details">
            <p><strong>地区：</strong>全国广泛分布</p>
            <p><strong>习性：</strong>善于筑巢，飞行敏捷</p>
            <p class="description">春来秋去，被视为吉祥物，在民间文化中备受喜爱。</p>
            <p class="search-count"><strong>近期搜索量：</strong>65,000</p>
          </div>
        </div>
        <div class="bird-image">
          <img :src="swallowImg" alt="燕子">
        </div>
      </div>
    
      <div class="bird-item rank-7">
        <div class="rank-number">7</div>
        <div class="bird-info">
          <h2>鹦鹉</h2>
          <div class="details">
            <p><strong>地区：</strong>南方地区</p>
            <p><strong>习性：</strong>群居，善于模仿人声</p>
            <p class="description">色彩艳丽，聪明伶俐，是深受欢迎的宠物鸟类。</p>
            <p class="search-count"><strong>近期搜索量：</strong>55,000</p>
          </div>
        </div>
        <div class="bird-image">
          <img :src="parrotImg" alt="鹦鹉">
        </div>
      </div>
    
      <div class="bird-item rank-8">
        <div class="rank-number">8</div>
        <div class="bird-info">
          <h2>猫头鹰</h2>
          <div class="details">
            <p><strong>地区：</strong>全国各地</p>
            <p><strong>习性：</strong>夜行性，善于捕食</p>
            <p class="description">目光锐利，头部可旋转270度，是优秀的夜间猎手。</p>
            <p class="search-count"><strong>近期搜索量：</strong>45,000</p>
          </div>
        </div>
        <div class="bird-image">
          <img :src="owlImg" alt="猫头鹰">
        </div>
      </div>
    
      <div class="bird-item rank-9">
        <div class="rank-number">9</div>
        <div class="bird-info">
          <h2>啄木鸟</h2>
          <div class="details">
            <p><strong>地区：</strong>温带森林地区</p>
            <p><strong>习性：</strong>啄木觅食，守护森林</p>
            <p class="description">森林医生，对维护生态平衡有重要作用。</p>
            <p class="search-count"><strong>近期搜索量：</strong>35,000</p>
          </div>
        </div>
        <div class="bird-image">
          <img :src="woodpeckerImg" alt="啄木鸟">
        </div>
      </div>
    
      <div class="bird-item rank-10">
        <div class="rank-number">10</div>
        <div class="bird-info">
          <h2>翠鸟</h2>
          <div class="details">
            <p><strong>地区：</strong>江河湖泊周边</p>
            <p><strong>习性：</strong>捕食小鱼，栖息于水边</p>
            <p class="description">羽毛艳丽，蓝绿相间，被誉为"飞翔的宝石"。</p>
            <p class="search-count"><strong>近期搜索量：</strong>30,000</p>
          </div>
        </div>
        <div class="bird-image">
          <img :src="kingfisherImg" alt="翠鸟">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import storkImg from '../assets/images/stork.jpg'
import ibisImg from '../assets/images/ibis.jpg'
import craneImg from '../assets/images/crane.jpg'
import orioleImg from '../assets/images/oriole.jpg'
import canaryImg from '../assets/images/canary.jpg'
import swallowImg from '../assets/images/swallow.jpg'
import parrotImg from '../assets/images/parrot.jpg'
import owlImg from '../assets/images/owl.jpg'
import woodpeckerImg from '../assets/images/woodpecker.jpg'
import kingfisherImg from '../assets/images/kingfisher.jpg'


export default {
  name: 'RankingPage',
  data() {
    return {
      storkImg,
      ibisImg,
      craneImg,
      orioleImg,
      canaryImg,
      swallowImg,
      parrotImg,
      owlImg,
      woodpeckerImg,
      kingfisherImg
    }
  }
}
</script>

<style scoped>
.ranking-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
}


.bird-item {
    display: flex;
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.bird-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rank-number {
    font-size: 2.5em;
    font-weight: bold;
    margin-right: 20px;
    color: #ff6b6b;
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bird-info {
    flex: 1;
    margin-right: 20px;
}

.bird-info h2 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.8em;
}

.details p {
    margin: 8px 0;
    color: #666;
    line-height: 1.6;
}

.description {
    margin: 15px 0;
    line-height: 1.8;
    color: #2c3e50;
}

.search-count {
    color: #ff6b6b;
    font-size: 0.9em;
    margin-top: 15px;
}

.bird-image {
    display: flex;
    align-items: center;
}

.bird-image img {
    object-fit: cover;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.rank-1 {
    width: 100%;
}

.rank-1 .bird-image img {
    width: 300px;
    height: 300px;
}

.rank-2 {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

.rank-2 .bird-image img {
    width: 250px;
    height: 250px;
}

.rank-3 {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

.rank-3 .bird-image img {
    width: 200px;
    height: 200px;
}

.secondary-ranks {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 40px;
}

.secondary-ranks .bird-item {
    width: 100%;
}

.secondary-ranks .bird-image img {
    width: 150px;
    height: 150px;
}

@media (max-width: 1200px) {
    .secondary-ranks {
        grid-template-columns: 1fr;
    }
    

    .rank-2, .rank-3 {
        width: 100%;
    }

}

@media (max-width: 768px) {
    .bird-item {
        flex-direction: column;
        width: 100% !important;
    }
    

    .bird-image {
        margin-top: 20px;
    }
    
    .bird-image img {
        width: 100% !important;
        height: auto !important;
    }
    
    .secondary-ranks {
        grid-template-columns: 1fr;
    }

}
</style> 
